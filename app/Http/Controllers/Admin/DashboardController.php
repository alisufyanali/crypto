<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Company;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isClient()) {
            return $this->clientDashboard();
        } elseif ($user->isBroker() || $user->isAdmin()) {
            return $this->brokerDashboard();
        }
        
        return redirect()->route('login');
    }
    
    private function clientDashboard()
    {
        $user = auth()->user();
        $portfolio = Portfolio::with('company.currentStock')
            ->where('user_id', $user->id)
            ->where('shares_owned', '>', 0)
            ->get();
            
        $accountBalance = $user->accountBalance ?? new \App\Models\AccountBalance(['cash_balance' => 0]);
        
        $recentOrders = Order::with('company')
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();
            
        $totalPortfolioValue = $portfolio->sum('current_value');
        $totalPnl = $portfolio->sum('unrealized_pnl') + $portfolio->sum('realized_pnl');
        
        return Inertia::render('Client/Dashboard', [
            'portfolio' => $portfolio,
            'accountBalance' => $accountBalance,
            'recentOrders' => $recentOrders,
            'totalPortfolioValue' => $totalPortfolioValue,
            'totalPnl' => $totalPnl,
            'kycStatus' => $user->kyc_status,
            'user' => Auth::user(), // 👈 ye props me user send hoga
        ]);
    }
    
    private function brokerDashboard()
    {
        $pendingOrders = Order::with(['user', 'company'])
            ->pending()
            ->latest()
            ->take(10)
            ->get();
            
        $todayOrders = Order::with(['user', 'company'])
            ->whereDate('created_at', today())
            ->count();
            
        $totalClients = User::clients()->active()->count();
        $pendingKyc = User::where('kyc_status', 'pending')->count();
        
        $topStocks = Company::with('currentStock')
            ->active()
            ->take(5)
            ->get();
            
        return Inertia::render('Broker/Dashboard', [
            'pendingOrders' => $pendingOrders,
            'stats' => [
                'todayOrders' => $todayOrders,
                'totalClients' => $totalClients,
                'pendingKyc' => $pendingKyc,
                'pendingOrdersCount' => $pendingOrders->count(),
            ],
            'topStocks' => $topStocks,
            'user' => Auth::user(), // 👈 ye props me user send hoga
        ]);
    }
}
