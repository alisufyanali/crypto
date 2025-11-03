<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccountBalance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class AccountBalanceController extends Controller
{
    public function index()
    {
        return Inertia::render('AccountBalances/Index');
    }

    public function getData()
    {
        $balances = AccountBalance::with('user')->latest();

        return DataTables::of($balances)
            ->addColumn('user_name', fn($row) => $row->user?->name ?? 'N/A')
            ->make(true);
    }

    public function create()
    {
        return Inertia::render('AccountBalances/Create', [
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }
    

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id|unique:account_balances,user_id',
            'cash_balance' => 'required|numeric|min:0',
            'invested_amount' => 'nullable|numeric|min:0',
            'total_portfolio_value' => 'nullable|numeric|min:0',
            'total_pnl' => 'nullable|numeric',
        ]);

        AccountBalance::create($request->all());

        return redirect()->route('account-balances.index')
            ->with('success', 'Account balance created successfully.');
    }
 
    public function show(AccountBalance $accountBalance)
    {
        return Inertia::render('AccountBalances/Show', [
            'account_balance' => $accountBalance->load('user'),
        ]);
    }

    public function edit(AccountBalance $accountBalance)
    {
        return Inertia::render('AccountBalances/Edit', [
            'balance' => [
                'id' => $accountBalance->id,
                'user_id' => $accountBalance->user_id ?? null,
                'cash_balance' => $accountBalance->cash_balance ?? 0,
                'invested_amount' => $accountBalance->invested_amount ?? 0,
                'total_portfolio_value' => $accountBalance->total_portfolio_value ?? 0,
                'total_pnl' => $accountBalance->total_pnl ?? 0,
                'user' => $accountBalance->user ? [
                    'id' => $accountBalance->user->id,
                    'name' => $accountBalance->user->name,
                    'email' => $accountBalance->user->email,
                ] : null
            ],
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    public function update(Request $request, AccountBalance $accountBalance)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'cash_balance' => 'required|numeric|min:0',
            'invested_amount' => 'nullable|numeric|min:0',
            'total_portfolio_value' => 'nullable|numeric|min:0',
            'total_pnl' => 'nullable|numeric',
        ]);

        $accountBalance->update($request->all());

        return redirect()->route('account-balances.index')
            ->with('success', 'Account balance updated successfully.');
    }

    public function destroy(AccountBalance $accountBalance)
    {
        $accountBalance->delete();

        return redirect()->route('account-balances.index')
            ->with('success', 'Account balance deleted successfully.');
    }
}