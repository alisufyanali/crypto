<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('Transactions/Index');
    }

    public function show(Transaction $transaction)
    {
        $user = auth()->user();
        
        // Check if user can view this transaction
        if (!$user->hasRole('admin') && $transaction->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this transaction.');
        }
        
        $transaction->load(['user', 'order.company']);
        
        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function getData(Request $request)
    {
        $user = auth()->user();
        
        $transactions = Transaction::with(['user', 'order.company'])
            // Role-based filtering
            ->when(!$user->hasRole('admin'), function($query) use ($user) {
                // Client aur Broker sirf apni transactions dekh sakte hain
                return $query->where('user_id', $user->id);
            })
            // Additional filters
            ->when($request->type, function($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->user_id && $user->hasRole('admin'), function($query, $userId) {
                // Only admin can filter by user_id
                return $query->where('user_id', $userId);
            })
            ->when($request->date_from, function($query, $dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function($query, $dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->latest();

        return DataTables::of($transactions)
            ->addColumn('user_name', function($transaction) {
                return $transaction->user->name ?? 'N/A';
            })
            ->addColumn('company_name', function($transaction) {
                return $transaction->order?->company?->name ?? 'N/A';
            })
            ->addColumn('formatted_amount', function($transaction) {
                return number_format($transaction->amount, 2);
            })
            ->addColumn('formatted_date', function($transaction) {
                return $transaction->created_at->format('Y-m-d H:i:s');
            })
            ->addColumn('type_badge', function($transaction) {
                $colors = [
                    'deposit' => 'success',
                    'withdrawal' => 'warning',
                    'buy' => 'info',
                    'sell' => 'primary',
                    'dividend' => 'secondary',
                ];
                return [
                    'type' => $transaction->type,
                    'color' => $colors[$transaction->type] ?? 'default'
                ];
            })
            ->make(true);
    }

    public function destroy(Transaction $transaction)
    {
        $user = auth()->user();
        
        // Check if user can delete this transaction
        if (!$user->hasRole('admin') && $transaction->user_id !== $user->id) {
            return back()->with('error', 'Unauthorized to delete this transaction.');
        }
        
        // Check if transaction can be deleted (business logic)
        if ($transaction->type === 'buy' || $transaction->type === 'sell') {
            return back()->with('error', 'Cannot delete buy/sell transactions.');
        }

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction deleted successfully.');
    }

    public function export(Request $request)
    {
        $user = auth()->user();
        
        $transactions = Transaction::with(['user', 'order.company'])
            // Role-based filtering
            ->when(!$user->hasRole('admin'), function($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            // Additional filters
            ->when($request->type, function($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->user_id && $user->hasRole('admin'), function($query, $userId) {
                return $query->where('user_id', $userId);
            })
            ->when($request->date_from, function($query, $dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function($query, $dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->latest()
            ->get();

        return response()->json($transactions);
    }
}