<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\AccountBalance;
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
        // $user = auth()->user();
        
        // // Check if user can view this transaction
        // if (!$user->hasRole('admin') && $transaction->user_id !== $user->id) {
        //     abort(403, 'Unauthorized access to this transaction.');
        // }
        
        $transaction->load(['user', 'order.company', 'processedBy']);
        
        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function edit(Transaction $transaction)
    {
        // $user = auth()->user();
        
        // // Only admin can edit transactions
        // if (!$user->hasRole('admin')) {
        //     abort(403, 'Unauthorized action.');
        // }
        
        $transaction->load(['user', 'order.company']);
        
        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $user = auth()->user();
        
        // // Only admin can update transactions
        // if (!$user->hasRole('admin')) {
        //     abort(403, 'Unauthorized action.');
        // }

        $request->validate([
            'adjusted_amount' => 'nullable|numeric|min:0',
            'fees' => 'nullable|numeric|min:0',
            'admin_notes' => 'nullable|string|max:1000',
            'status' => 'required|in:pending,completed,failed,cancelled',
        ]);

        $updateData = [
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'processed_by' => $user->id,
            'processed_at' => now(),
        ];

        // Only update adjusted amount and fees for deposit/withdrawal
        if ($transaction->isDeposit() || $transaction->isWithdrawal()) {
            $updateData['adjusted_amount'] = $request->adjusted_amount ?? $transaction->amount;
            $updateData['fees'] = $request->fees ?? 0;
        }

        $transaction->update($updateData);

        // If transaction is completed and it's a deposit/withdrawal, update balance
        if ($request->status === 'completed' && ($transaction->isDeposit() || $transaction->isWithdrawal())) {
            $this->processTransaction($transaction);
        }

        // Notify user about transaction update
        if ($transaction->user_id) {
            createNotification(
                'client',
                "Your {$transaction->type} transaction has been updated. Status: {$request->status}",
                $transaction->user_id,
                'transaction',
                'Transaction Updated'
            );
        }

        return redirect()->route('transactions.show', $transaction)
            ->with('success', 'Transaction updated successfully.');
    }

    public function getData(Request $request)
    {
        $user = auth()->user();
        
        $transactions = Transaction::with(['user', 'order.company', 'processedBy'])
            // Role-based filtering
            ->when(!$user->hasRole('admin'), function($query) use ($user) {
                // Client aur Broker sirf apni transactions dekh sakte hain
                return $query->where('user_id', $user->id);
            })
            // Additional filters
            ->when($request->type, function($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->status, function($query, $status) {
                return $query->where('status', $status);
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
                // Show adjusted amount if available
                $amount = $transaction->display_amount;
                return number_format($amount, 2);
            })
            ->addColumn('original_amount', function($transaction) {
                return number_format($transaction->amount, 2);
            })
            ->addColumn('fees_display', function($transaction) {
                return $transaction->fees ? number_format($transaction->fees, 2) : '0.00';
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
            ->addColumn('status_badge', function($transaction) {
                $colors = [
                    'pending' => 'warning',
                    'completed' => 'success',
                    'failed' => 'danger',
                    'cancelled' => 'secondary',
                ];
                return [
                    'status' => $transaction->status,
                    'color' => $colors[$transaction->status] ?? 'default'
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

        // If transaction was completed, reverse the balance changes
        if ($transaction->isCompleted() && ($transaction->isDeposit() || $transaction->isWithdrawal())) {
            $this->reverseTransaction($transaction);
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

   
    private function reverseTransaction(Transaction $transaction)
    {
        $user = $transaction->user;
        $balance = $user->accountBalance;

        if ($balance) {
            $netAmount = $transaction->display_amount;

            if ($transaction->isDeposit()) {
                $balance->decrement('cash_balance', $netAmount);
            } elseif ($transaction->isWithdrawal()) {
                $balance->increment('cash_balance', $netAmount);
            }
        }
    }


    public function createDeposit()
    {
        $userBalance = auth()->user()->accountBalance?->cash_balance ?? 0;
        
        return Inertia::render('Transactions/CreateDeposit', [
            'userBalance' => $userBalance,
        ]);
    }

    public function createWithdrawal()
    {
        $userBalance = auth()->user()->accountBalance?->cash_balance ?? 0;
        
        return Inertia::render('Transactions/CreateWithdrawal', [
            'userBalance' => $userBalance,
        ]);
    }

    public function storeDeposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'comments' => 'nullable|string|max:1000',
            'payment_method' => 'required|string|max:255',
            'transaction_proof' => 'nullable|file|max:10240', // 10MB max
        ]);

        $user = auth()->user();

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => 'deposit',
            'amount' => $request->amount,
            'adjusted_amount' => $request->amount, // Initially same as amount
            'description' => 'Deposit via ' . $request->payment_method,
            'comments' => $request->comments,
            'status' => 'pending',
            'metadata' => [
                'payment_method' => $request->payment_method,
                'proof_uploaded' => $request->hasFile('transaction_proof'),
            ],
        ]);

        // File upload handle karein
        if ($request->hasFile('transaction_proof')) {
            $path = $request->file('transaction_proof')->store('transaction-proofs', 'public');
            $transaction->update([
                'metadata->proof_path' => $path
            ]);
        }

        // Admin ko notification bhejein
        createNotification(
            'admin',
            "New deposit request of " . number_format($request->amount, 2) . " from {$user->name}",
            1, // admin user ID
            'transaction',
            'New Deposit Request'
        );

        return redirect()->route('transactions.index')
            ->with('success', 'Deposit request submitted successfully. It will be processed after verification.');
    }

    public function storeWithdrawal(Request $request)
    {
        $user = auth()->user();
        $userBalance = $user->accountBalance?->cash_balance ?? 0;

        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $userBalance,
            'comments' => 'nullable|string|max:1000',
            'bank_account' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
        ]);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => 'withdrawal',
            'amount' => $request->amount,
            'adjusted_amount' => $request->amount, // Initially same as amount
            'description' => 'Withdrawal to ' . $request->bank_account,
            'comments' => $request->comments,
            'status' => 'pending',
            'metadata' => [
                'bank_account' => $request->bank_account,
                'account_number' => $request->account_number,
            ],
        ]);

        // Temporary balance hold (optional)
        $balance = $user->accountBalance;
        if ($balance) {
            $balance->update([
                'cash_balance' => $balance->cash_balance - $request->amount,
                'pending_withdrawals' => ($balance->pending_withdrawals ?? 0) + $request->amount,
            ]);
        }

        // Admin ko notification bhejein
        createNotification(
            'admin',
            "New withdrawal request of " . number_format($request->amount, 2) . " from {$user->name}",
            1, // admin user ID
            'transaction',
            'New Withdrawal Request'
        );

        return redirect()->route('transactions.index')
            ->with('success', 'Withdrawal request submitted successfully. It will be processed within 24-48 hours.');
    }

    public function adjustAmount(Request $request, Transaction $transaction)
    {
        // Only admin can adjust amounts
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized action.');
        }

        // Only pending deposits/withdrawals can be adjusted
        if (!$transaction->isPending() || !in_array($transaction->type, ['deposit', 'withdrawal'])) {
            return back()->with('error', 'Only pending deposits/withdrawals can be adjusted.');
        }

        $request->validate([
            'adjusted_amount' => 'required|numeric|min:0.01',
            'fees' => 'required|numeric|min:0',
            'admin_notes' => 'required|string|max:1000',
        ]);

        $transaction->update([
            'adjusted_amount' => $request->adjusted_amount,
            'fees' => $request->fees,
            'admin_notes' => $request->admin_notes,
        ]);

        // User ko notification bhejein about adjustment
        createNotification(
            'client',
            "Your {$transaction->type} amount has been adjusted. Original: " . number_format($transaction->amount, 2) . ", Adjusted: " . number_format($request->adjusted_amount, 2) . ", Fees: " . number_format($request->fees, 2),
            $transaction->user_id,
            'transaction',
            'Transaction Amount Adjusted'
        );

        return back()->with('success', 'Transaction amount adjusted successfully.');
    }

    public function approve(Request $request, Transaction $transaction)
    {
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        try {
            \DB::beginTransaction();

            $transaction->update([
                'status' => 'completed',
                'processed_by' => auth()->id(),
                'processed_at' => now(),
                'admin_notes' => $request->admin_notes ?? $transaction->admin_notes,
            ]);

            // Actual balance update karein
            $this->processTransaction($transaction);

            \DB::commit();

            // User ko notification bhejein
            createNotification(
                'client',
                "Your {$transaction->type} has been processed successfully.",
                $transaction->user_id,
                'transaction',
                'Transaction Completed'
            );

            return back()->with('success', 'Transaction approved successfully.');
        } catch (\Exception $e) {
            \DB::rollBack();
            return back()->with('error', 'Failed to process transaction: ' . $e->getMessage());
        }
    }

    public function reject(Request $request, Transaction $transaction)
    {
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $transaction->update([
            'status' => 'failed',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        // Agar withdrawal tha toh hold wala amount wapas karein
        if ($transaction->type === 'withdrawal') {
            $balance = $transaction->user->accountBalance;
            if ($balance) {
                $balance->update([
                    'cash_balance' => $balance->cash_balance + $transaction->amount,
                    'pending_withdrawals' => max(0, ($balance->pending_withdrawals ?? 0) - $transaction->amount),
                ]);
            }
        }

        // User ko notification bhejein
        createNotification(
            'client',
            "Your {$transaction->type} has been rejected. Reason: {$request->admin_notes}",
            $transaction->user_id,
            'transaction',
            'Transaction Rejected'
        );

        return back()->with('success', 'Transaction rejected.');
    }

    private function processTransaction(Transaction $transaction)
    {
        $user = $transaction->user;
        $balance = $user->accountBalance ?? AccountBalance::create(['user_id' => $user->id]);

        $netAmount = $transaction->adjusted_amount ?? $transaction->amount;

        if ($transaction->type === 'deposit') {
            $balance->increment('cash_balance', $netAmount);
        } elseif ($transaction->type === 'withdrawal') {
            // Pending withdrawal amount adjust karein
            $balance->update([
                'pending_withdrawals' => max(0, ($balance->pending_withdrawals ?? 0) - $transaction->amount),
            ]);
            // Actual amount deduct karein (adjusted amount)
            $balance->decrement('cash_balance', $netAmount);
        }
    }

    //  private function processTransaction(Transaction $transaction)
    // {
    //     $user = $transaction->user;
    //     $balance = $user->accountBalance ?? AccountBalance::create(['user_id' => $user->id]);

    //     $netAmount = $transaction->display_amount;

    //     if ($transaction->isDeposit()) {
    //         $balance->increment('cash_balance', $netAmount);
    //     } elseif ($transaction->isWithdrawal()) {
    //         $balance->decrement('cash_balance', $netAmount);
    //     }
    // }




}