// resources/js/Pages/Transactions/Edit.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, DollarSign, FileText, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Transaction {
    id: number;
    transaction_id: string;
    type: string;
    amount: number;
    adjusted_amount: number | null;
    fees: number;
    status: string;
    description: string;
    comments: string | null;
    admin_notes: string | null;
    created_at: string;
    user: User;
}

interface Props {
    transaction: Transaction;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Transactions', href: '/transactions' },
    { title: 'Edit Transaction', href: '#' }
];

export default function TransactionEdit({ transaction }: Props) {
    const [formData, setFormData] = useState({
        adjusted_amount: transaction.adjusted_amount?.toString() || transaction.amount.toString(),
        fees: transaction.fees?.toString() || '0',
        admin_notes: transaction.admin_notes || '',
        status: transaction.status,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.put(`/transactions/${transaction.id}`, formData, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const calculateNetAmount = () => {
        const amount = parseFloat(formData.adjusted_amount) || transaction.amount;
        const fees = parseFloat(formData.fees) || 0;
        
        if (transaction.type === 'deposit') {
            return amount - fees;
        } else if (transaction.type === 'withdrawal') {
            return amount - fees;
        }
        return amount;
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
        };
        return colors[status as keyof typeof colors] || colors.pending;
    };

    const getTypeColor = (type: string) => {
        const colors = {
            deposit: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            withdrawal: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            buy: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            sell: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Transaction - ${transaction.transaction_id}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/transactions"
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Edit Transaction
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {transaction.transaction_id}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Edit Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Transaction Details
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Transaction Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Client
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {transaction.user.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {transaction.user.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Type
                                        </label>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                            {transaction.type.toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Original Amount
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {formatCurrency(transaction.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Current Status
                                        </label>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                            {transaction.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Amount Adjustment (only for deposits/withdrawals) */}
                                {(transaction.type === 'deposit' || transaction.type === 'withdrawal') && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            <DollarSign className="w-5 h-5 mr-2" />
                                            Amount Adjustment
                                        </h3>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="adjusted_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Adjusted Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    id="adjusted_amount"
                                                    min="0"
                                                    step="0.01"
                                                    value={formData.adjusted_amount}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, adjusted_amount: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                                {errors.adjusted_amount && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.adjusted_amount}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="fees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Fees
                                                </label>
                                                <input
                                                    type="number"
                                                    id="fees"
                                                    min="0"
                                                    step="0.01"
                                                    value={formData.fees}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                                {errors.fees && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fees}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Net Amount Display */}
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                    Net Amount (After Fees):
                                                </span>
                                                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                                                    {formatCurrency(calculateNetAmount())}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                                                Client will receive this amount after deducting fees
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Status Update */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="failed">Failed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                    )}
                                </div>

                                {/* Admin Notes */}
                                <div>
                                    <label htmlFor="admin_notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        id="admin_notes"
                                        rows={4}
                                        value={formData.admin_notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Add internal notes about this transaction..."
                                    />
                                    {errors.admin_notes && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.admin_notes}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <Link
                                        href="/transactions"
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processing ? 'Updating...' : 'Update Transaction'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Transaction Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                        {transaction.type}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Original Amount:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                </div>
                                {(transaction.type === 'deposit' || transaction.type === 'withdrawal') && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Adjusted Amount:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(parseFloat(formData.adjusted_amount) || transaction.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Fees:</span>
                                            <span className="font-medium text-red-600 dark:text-red-400">
                                                -{formatCurrency(parseFloat(formData.fees) || 0)}
                                            </span>
                                        </div>
                                        <hr className="dark:border-gray-600" />
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span className="text-gray-900 dark:text-white">Net Amount:</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {formatCurrency(calculateNetAmount())}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Client Comments */}
                        {transaction.comments && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Client Comments
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {transaction.comments}
                                </p>
                            </div>
                        )}

                        {/* Important Notice */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        Important
                                    </h4>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                        Changing the amount or status will affect the client's balance and will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}