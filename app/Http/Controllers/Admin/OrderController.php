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

        return Inertia::render('Orders/Index', [
            'companies' => $companies,
            'isClient' => $user->isClient(),
        ]);
    }

    // New method for DataTable data fetching
    public function data(Request $request)
    {
        $user = auth()->user();
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        $query = Order::with(['user', 'company', 'approvedBy', 'executedBy']);

        // If client, show only their orders
        if ($user->isClient()) {
            $query->where('user_id', $user->id);
        }

        // Apply filters
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('type') && $request->type !== '') {
            $query->where('type', $request->type);
        }

        if ($request->has('company_id') && $request->company_id !== '') {
            $query->where('company_id', $request->company_id);
        }

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search, $user) {
                $q->whereHas('company', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('symbol', 'like', "%{$search}%");
                });
                
                // Only search by user name if admin/broker
                if (!$user->isClient()) {
                    $q->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                }
                
                $q->orWhere('status', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $orders = $query->paginate($perPage);

        return response()->json($orders);
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

        // Send notification to admin
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
 
    public function edit(Order $order)
    {
        // Check if user owns the order or is admin
        $user = auth()->user();
        
        if (!$user->isClient() || $order->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }
        
        // Only allow editing pending orders
        if ($order->status !== 'pending') {
            return redirect()->route('orders.show', $order)
                ->with('error', 'Only pending orders can be edited.');
        }
        
        $companies = Company::active()
            ->with('currentStock')
            ->orderBy('name')
            ->get();
            
        $userBalance = $user->accountBalance?->cash_balance ?? 0;
        
        return Inertia::render('Orders/Edit', [
            'order' => $order->load('company'),
            'companies' => $companies,
            'userBalance' => $userBalance,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        // Check if user owns the order or is admin
        $user = auth()->user();
        
        if ($user->isClient() && $order->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }
        
        // Only allow updating pending orders
        if ($order->status !== 'pending') {
            return back()->with('error', 'Only pending orders can be updated.');
        }
        
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'type' => 'required|in:buy,sell',
            'quantity' => 'required|integer|min:1',
            'price_per_share' => 'required|numeric|min:0.01',
        ]);
        
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
        
        $company = Company::findOrFail($request->company_id);
        
        $order->update([
            'company_id' => $request->company_id,
            'type' => $request->type,
            'quantity' => $request->quantity,
            'price_per_share' => $request->price_per_share,
            'total_amount' => $totalAmount,
        ]);
        
        return redirect()->route('orders.show', $order)
            ->with('success', 'Order updated successfully.');
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

        // Notify client
        createNotification(
            'client',
            "Your {$order->type} order for {$order->company->name} has been approved.",
            $order->user_id,
            'order',
            'Order Approved'
        );
        
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

        // Notify client
        createNotification(
            'client',
            "Your {$order->type} order for {$order->company->name} has been rejected.",
            $order->user_id,
            'order',
            'Order Rejected'
        );
        
        return back()->with('success', 'Order rejected.');
    }
    
    public function execute(Order $order)
    {
        // if ($order->status !== 'approved') {
        //     return back()->withErrors(['error' => 'Order must be approved before execution.']);
        // }
        
        // DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'executed',
                'executed_by' => auth()->id(),
                'executed_at' => now(),
            ]);
            
            $user = $order->user;

            if ($order->type === 'buy') {
                $this->processBuyOrder($order);
            } else {
                $this->processSellOrder($order);
            }
            return 1;
            
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

            // Notify client
            createNotification(
                'client',
                "Your {$order->type} order for {$order->company->name} has been executed.",
                $order->user_id,
                'order',
                'Order Executed'
            );
        // });
        
        return back()->with('success', 'Order executed successfully.');
    }

    public function destroy(Order $order)
    {
        // Only allow deletion of pending orders
        if ($order->status !== 'pending') {
            return back()->with('error', 'Only pending orders can be deleted.');
        }

        // Check if user owns the order or is admin
        if (!auth()->user()->isClient() || $order->user_id === auth()->id()) {
            $order->delete();
            return back()->with('success', 'Order deleted successfully.');
        }

        return back()->with('error', 'Unauthorized action.');
    }
    
    private function processBuyOrder(Order $order)
    {
        $user = $order->user;
        
        $balance = $user->accountBalance ?? AccountBalance::create(['user_id' => $user->id]);
        $balance->decrement('cash_balance', $order->total_amount);
        
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

    $portfolio = Portfolio::where('user_id', $user->id)
        ->where('company_id', $order->company_id)
        ->first();

    if (!$portfolio) {
        throw new \Exception("No portfolio found for this company.");
    }

    if ($portfolio->shares_owned < $order->quantity) {
        throw new \Exception("Not enough shares to sell.");
    }

    $saleValue = $order->total_amount;
    $costBasis = $portfolio->average_cost * $order->quantity;
    $realizedPnl = $saleValue - $costBasis;

    $portfolio->update([
        'shares_owned' => $portfolio->shares_owned - $order->quantity,
        'total_invested' => $portfolio->total_invested - $costBasis,
        'realized_pnl' => $portfolio->realized_pnl + $realizedPnl,
    ]);

    $balance = $user->accountBalance ?? AccountBalance::create(['user_id' => $user->id]);
    $balance->increment('cash_balance', $saleValue);

    if (method_exists($portfolio, 'updateCurrentValue')) {
        $portfolio->updateCurrentValue();
    }

    if (method_exists($balance, 'updateFromPortfolio')) {
        $balance->updateFromPortfolio();
    }
}

}