<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Company;
use App\Models\Portfolio;
use App\Models\AccountBalance;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $user = auth()->user();
          $companies = Company::active()
            ->with('currentStock')
            ->orderBy('name')
            ->get();
            

        if ($user->isClient()) {
            $orders = Order::with('company')
                ->where('user_id', $user->id)
                ->latest()
                ->paginate(20);
        } else {
            $orders = Order::with(['user', 'company'])
                ->when(request('status'), function ($query, $status) {
                    return $query->where('status', $status);
                })
                ->when(request('type'), function ($query, $type) {
                    return $query->where('type', $type);
                })
                ->latest()
                ->paginate(20);
        }
        
        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'companies' => $companies,
            'filters' => request()->only(['status', 'type']),
        ]);
    }
    
    public function create()
    {
        $companies = Company::active()
            ->with('currentStock')
            ->orderBy('name')
            ->get();
            
        $userBalance = auth()->user()->accountBalance?->cash_balance ?? 0;
        
        return Inertia::render('Orders/Create', [
            'companies' => $companies,
            'userBalance' => $userBalance,
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'type' => 'required|in:buy,sell',
            'quantity' => 'required|integer|min:1',
            'price_per_share' => 'required|numeric|min:0.01',
        ]);
        
        $user = auth()->user();
        $company = Company::findOrFail($request->company_id);
        $totalAmount = $request->quantity * $request->price_per_share;
        
        // Validation based on order type
        if ($request->type === 'buy') {
            $userBalance = $user->accountBalance?->cash_balance ?? 0;
            if ($totalAmount > $userBalance) {
                return back()->withErrors(['quantity' => 'Insufficient balance for this purchase.']);
            }
        } else {
            $portfolio = Portfolio::where('user_id', $user->id)
                ->where('company_id', $request->company_id)
                ->first();
                
            if (!$portfolio || $portfolio->shares_owned < $request->quantity) {
                return back()->withErrors(['quantity' => 'Insufficient shares to sell.']);
            }
        }

        $order = Order::create([
            'user_id' => $user->id,
            'company_id' => $request->company_id,
            'type' => $request->type,
            'quantity' => $request->quantity,
            'price_per_share' => $request->price_per_share,
            'total_amount' => $totalAmount,
            'status' => 'pending',
        ]);

        // ✅ Send notification to admin (user_id = 1)
        createNotification(
            'admin',
            "New {$request->type} order placed by {$user->name} for {$company->name} ({$request->quantity} shares).",
            1,
            'order',
            'New Order Pending Approval'
        );

        return redirect()->route('orders.index')
            ->with('success', 'Order submitted successfully and is pending approval.');
    }

    
    public function show(Order $order)
    {
        
        $order->load(['user', 'company', 'approvedBy', 'executedBy']);
        
        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
    
    public function approve(Order $order)
    {
        
        $order->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);
        
        return back()->with('success', 'Order approved successfully.');
    }
    
    public function reject(Request $request, Order $order)
    {
        
        $request->validate([
            'notes' => 'required|string|max:1000',
        ]);
        
        $order->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'notes' => $request->notes,
        ]);
        
        return back()->with('success', 'Order rejected.');
    }
    
    public function execute(Order $order)
    {
        
        if ($order->status !== 'approved') {
            return back()->withErrors(['error' => 'Order must be approved before execution.']);
        }
        
        DB::transaction(function () use ($order) {
            // Update order status
            $order->update([
                'status' => 'executed',
                'executed_by' => auth()->id(),
                'executed_at' => now(),
            ]);
            
            $user = $order->user;
            
            // Update portfolio and account balance
            if ($order->type === 'buy') {
                $this->processBuyOrder($order);
            } else {
                $this->processSellOrder($order);
            }
            
            // Create transaction record
            Transaction::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'type' => $order->type,
                'amount' => $order->total_amount,
                'description' => "{$order->type} {$order->quantity} shares of {$order->company->name}",
                'metadata' => [
                    'company_id' => $order->company_id,
                    'quantity' => $order->quantity,
                    'price_per_share' => $order->price_per_share,
                ],
            ]);
        });
        
        return back()->with('success', 'Order executed successfully.');
    }
    
    private function processBuyOrder(Order $order)
    {
        $user = $order->user;
        
        // Update account balance
        $balance = $user->accountBalance ?? AccountBalance::create(['user_id' => $user->id]);
        $balance->decrement('cash_balance', $order->total_amount);
        
        // Update or create portfolio entry
        $portfolio = Portfolio::firstOrCreate(
            ['user_id' => $user->id, 'company_id' => $order->company_id],
            ['shares_owned' => 0, 'average_cost' => 0, 'total_invested' => 0]
        );
        
        $newTotalShares = $portfolio->shares_owned + $order->quantity;
        $newTotalInvested = $portfolio->total_invested + $order->total_amount;
        $newAverageCost = $newTotalInvested / $newTotalShares;
        
        $portfolio->update([
            'shares_owned' => $newTotalShares,
            'total_invested' => $newTotalInvested,
            'average_cost' => $newAverageCost,
        ]);
        
        $portfolio->updateCurrentValue();
        $balance->updateFromPortfolio();
    }
    
    private function processSellOrder(Order $order)
    {
        $user = $order->user;
        
        // Update portfolio
        $portfolio = Portfolio::where('user_id', $user->id)
            ->where('company_id', $order->company_id)
            ->firstOrFail();
            
        $saleValue = $order->total_amount;
        $costBasis = $portfolio->average_cost * $order->quantity;
        $realizedPnl = $saleValue - $costBasis;
        
        $portfolio->update([
            'shares_owned' => $portfolio->shares_owned - $order->quantity,
            'total_invested' => $portfolio->total_invested - $costBasis,
            'realized_pnl' => $portfolio->realized_pnl + $realizedPnl,
        ]);
        
        // Update account balance
        $balance = $user->accountBalance ?? AccountBalance::create(['user_id' => $user->id]);
        $balance->increment('cash_balance', $saleValue);
        
        $portfolio->updateCurrentValue();
        $balance->updateFromPortfolio();
    }
}
