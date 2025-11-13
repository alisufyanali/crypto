import React, { useState } from 'react';
import { ArrowLeft, DollarSign, AlertCircle, Save } from 'lucide-react';

// Mock data for demonstration
const mockTransaction = {
    id: 1,
    transaction_id: 'TXN-12345',
    type: 'deposit',
    amount: 100.00,
    adjusted_amount: 99.00,
    fees: 1.00,
    status: 'pending',
    description: 'Deposit via Bank Transfer',
    comments: 'Initial deposit from client',
    admin_notes: '',
    metadata: {
        payment_method: 'bank_transfer',
        bank_reference: 'REF123456'
    },
    created_at: '2025-01-10T10:30:00',
    user: {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com'
    }
};

const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
        deposit: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        withdrawal: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    };
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
};

export default function TransactionEdit() {
    const transaction = mockTransaction;

    const [formData, setFormData] = useState({
        adjusted_amount: transaction.adjusted_amount?.toString() || transaction.amount.toString(),
        fees: transaction.fees?.toString() || '0',
        admin_notes: transaction.admin_notes || '',
        status: transaction.status || 'pending',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const calculateNetAmount = () => {
        const adjusted = parseFloat(formData.adjusted_amount) || 0;
        const fees = parseFloat(formData.fees) || 0;
        return adjusted - fees;
    };

    const handleSubmit = () => {
        setProcessing(true);
        setErrors({});

        // Validation
        const newErrors: Record<string, string> = {};

        if (!formData.adjusted_amount || parseFloat(formData.adjusted_amount) <= 0) {
            newErrors.adjusted_amount = 'Please enter a valid adjusted amount';
        }

        if (!formData.admin_notes.trim()) {
            newErrors.admin_notes = 'Please provide admin notes explaining the adjustment';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setProcessing(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            alert('Transaction updated successfully!');
            setProcessing(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Transactions</span>
                    <span>/</span>
                    <span>Transaction #{transaction.id}</span>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">Edit</span>
                </nav>

                <div className="max-w-6xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Edit Transaction
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Adjust amount and add notes for {transaction.type}
                                </p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${getTypeBadgeColor(transaction.type)}`}>
                            {transaction.type}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Transaction Details
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        ID: {transaction.transaction_id}
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* User Info (Read Only) */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">User:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{transaction.user.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{transaction.user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Original Amount (Read Only) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Original Amount Requested
                                        </label>
                                        <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Adjusted Amount */}
                                    <div>
                                        <label htmlFor="adjusted_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Adjusted Amount (After Processing) *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                id="adjusted_amount"
                                                min="0"
                                                step="0.01"
                                                value={formData.adjusted_amount}
                                                onChange={(e) => setFormData(prev => ({ ...prev, adjusted_amount: e.target.value }))}
                                                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter actual amount received"
                                            />
                                        </div>
                                        {errors.adjusted_amount && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.adjusted_amount}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            The actual amount received after bank/payment gateway processing
                                        </p>
                                    </div>

                                    {/* Fees */}
                                    <div>
                                        <label htmlFor="fees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Transaction Fees
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                id="fees"
                                                min="0"
                                                step="0.01"
                                                value={formData.fees}
                                                onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                                                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter transaction fees"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Bank charges, payment gateway fees, etc.
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status *
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
                                    </div>

                                    {/* Admin Notes */}
                                    <div>
                                        <label htmlFor="admin_notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Admin Notes *
                                        </label>
                                        <textarea
                                            id="admin_notes"
                                            rows={4}
                                            value={formData.admin_notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Explain why amount was adjusted, any issues during processing, etc."
                                        />
                                        {errors.admin_notes && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.admin_notes}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            This note will be visible to the user
                                        </p>
                                    </div>

                                    {/* Client Comments (Read Only) */}
                                    {transaction.comments && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Client Comments
                                            </label>
                                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <p className="text-gray-700 dark:text-gray-300">{transaction.comments}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Save className="w-5 h-5 mr-2" />
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => alert('Cancelled')}
                                            className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            {/* Amount Breakdown */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Amount Breakdown
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Original:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(transaction.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Adjusted:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(parseFloat(formData.adjusted_amount) || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Fees:</span>
                                            <span className="font-medium text-red-600 dark:text-red-400">
                                                -{formatCurrency(parseFloat(formData.fees) || 0)}
                                            </span>
                                        </div>
                                        <hr className="dark:border-gray-600" />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-gray-900 dark:text-white">Net Amount:</span>
                                            <span className={calculateNetAmount() >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                                {formatCurrency(calculateNetAmount())}
                                            </span>
                                        </div>
                                    </div>

                                    {transaction.amount !== parseFloat(formData.adjusted_amount) && (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                            <div className="flex items-start">
                                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                                                        Amount Adjusted
                                                    </p>
                                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                                        Difference: {formatCurrency(Math.abs(transaction.amount - parseFloat(formData.adjusted_amount)))}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Details */}
                            {transaction.metadata && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Payment Details
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {Object.entries(transaction.metadata).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                    {key.replace(/_/g, ' ')}:
                                                </span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {String(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Important Notice */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Important
                                        </h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                            User will be notified about any changes made to their transaction. Make sure to provide clear explanation in admin notes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}