<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isClient()) {
            return $this->clientPortfolio();
        } else {
            return $this->allPortfolios();
        }
    }
    
    private function clientPortfolio()
    {
        $user = auth()->user();
        
        $portfolio = Portfolio::with(['company.currentStock'])
            ->where('user_id', $user->id)
            ->get();
            
        $accountBalance = $user->accountBalance;
        
        // Calculate summary statistics
        $totalInvested = $portfolio->sum('total_invested');
        $currentValue = $portfolio->sum('current_value');
        $totalPnl = $portfolio->sum('unrealized_pnl') + $portfolio->sum('realized_pnl');
        $totalPnlPercentage = $totalInvested > 0 ? ($totalPnl / $totalInvested) * 100 : 0;
        
        return Inertia::render('Portfolio/ClientView', [
            'portfolio' => $portfolio,
            'accountBalance' => $accountBalance,
            'summary' => [
                'totalInvested' => $totalInvested,
                'currentValue' => $currentValue,
                'totalPnl' => $totalPnl,
                'totalPnlPercentage' => $totalPnlPercentage,
                'cashBalance' => $accountBalance?->cash_balance ?? 0,
                'totalAccountValue' => ($accountBalance?->cash_balance ?? 0) + $currentValue,
            ],
        ]);
    }
    
    private function allPortfolios()
    {
        $portfolios = Portfolio::with(['user', 'company.currentStock'])
            ->when(request('user_id'), function ($query, $userId) {
                return $query->where('user_id', $userId);
            })
            ->when(request('company_id'), function ($query, $companyId) {
                return $query->where('company_id', $companyId);
            })
            ->paginate(20);
            
        $users = \App\Models\User::clients()->active()->select('id', 'name', 'email')->get();
        $companies = Company::active()->select('id', 'name', 'symbol')->get();
        
        return Inertia::render('Portfolio/AdminView', [
            'portfolios' => $portfolios,
            'users' => $users,
            'companies' => $companies,
            'filters' => request()->only(['user_id', 'company_id']),
        ]);
    }
    
    public function updateBalance(Request $request, \App\Models\User $user)
    {
        // $this->authorize('updateBalance', $user);
        
        $request->validate([
            'amount' => 'required|numeric',
            'type' => 'required|in:deposit,withdrawal',
        ]);
        
        $balance = $user->accountBalance ?? \App\Models\AccountBalance::create(['user_id' => $user->id]);
        
        if ($request->type === 'deposit') {
            $balance->increment('cash_balance', $request->amount);
            $description = "Cash deposit";
        } else {
            if ($balance->cash_balance < $request->amount) {
                return back()->withErrors(['amount' => 'Insufficient balance for withdrawal.']);
            }
            $balance->decrement('cash_balance', $request->amount);
            $description = "Cash withdrawal";
        }
        
        // Create transaction record
        \App\Models\Transaction::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $description,
        ]);
        
        return back()->with('success', 'Account balance updated successfully.');
    }
}