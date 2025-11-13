    // resources/js/Pages/Transactions/CreateDeposit.tsx
    import React, { useState } from 'react';
    import { Head, Link, router } from '@inertiajs/react';
    import { ArrowLeft, Upload, DollarSign } from 'lucide-react';
    import AppLayout from '@/layouts/app-layout';
    import { type BreadcrumbItem } from '@/types';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transactions', href: '/transactions' },
        { title: 'Deposit Funds', href: '#' }
    ];

    export default function CreateDeposit({ userBalance }: { userBalance: number }) {
        const [formData, setFormData] = useState({
            amount: '',
            comments: '',
            payment_method: 'bank_transfer',
            transaction_proof: null as File | null,
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

            router.post('/transactions/deposit', formData, {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
                forceFormData: true,
            });
        };

        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Deposit Funds" />

                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                        <Link
                            href="/transactions"
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Deposit Funds
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Add money to your trading account
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Deposit Details
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Current Balance */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-800 dark:text-blue-200 font-medium">
                                        Current Balance:
                                    </span>
                                    <span className="text-blue-800 dark:text-blue-200 font-bold text-lg">
                                        {formatCurrency(userBalance)}
                                    </span>
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Deposit Amount (RWF)
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    min="0.01"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter amount"
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    id="payment_method"
                                    value={formData.payment_method}
                                    onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="credit_card">Credit Card</option>
                                </select>
                            </div>

                            {/* Transaction Proof */}
                            <div>
                                <label htmlFor="transaction_proof" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Transaction Proof (Optional)
                                </label>
                                <input
                                    type="file"
                                    id="transaction_proof"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setFormData(prev => ({ 
                                        ...prev, 
                                        transaction_proof: e.target.files?.[0] || null 
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Upload screenshot or receipt of your payment (JPEG, PNG, PDF, max 10MB)
                                </p>
                            </div>

                            {/* Comments */}
                            <div>
                                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Additional Comments (Optional)
                                </label>
                                <textarea
                                    id="comments"
                                    rows={3}
                                    value={formData.comments}
                                    onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Any additional information about this deposit..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing || !formData.amount}
                                    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    {processing ? 'Processing...' : 'Submit Deposit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AppLayout>
        );
    }