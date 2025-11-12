import React from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

interface User {
    id: number;
    name: string;
    email: string;
}

interface FormData {
    user_id: string;
    cash_balance: string;
    invested_amount: string;
    total_portfolio_value: string;
    total_pnl: string;
}

// Define the page props inline with usePage
type PageProps = {
    users: User[];
};

export default function CreateAccountBalance() {
    const { users } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm<FormData>({
        user_id: "",
        cash_balance: "",
        invested_amount: "",
        total_portfolio_value: "",
        total_pnl: "",
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Account Balances", href: "/account-balances" },
        { title: "Create Balance", href: "/account-balances/create" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/account-balances");
    };

    const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData(field, e.target.value);
    };

    const formatLabel = (field: string): string => {
        return field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    // Calculate totals for preview
    const cashBalance = parseFloat(data.cash_balance) || 0;
    const investedAmount = parseFloat(data.invested_amount) || 0;
    const portfolioValue = parseFloat(data.total_portfolio_value) || 0;
    const totalPnl = parseFloat(data.total_pnl) || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Account Balance" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl flex items-center justify-center shadow-lg transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                                    Create Account Balance
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                                    Add a new account balance for a user
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 transition-colors">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                                Account Balance Details
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* User Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                    Select User *
                                </label>
                                <select
                                    value={data.user_id}
                                    onChange={handleInputChange("user_id")}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200 py-3 px-4 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="" className="text-gray-900 dark:text-white">Choose a user...</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id} className="text-gray-900 dark:text-white">
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && (
                                    <p className="text-red-600 dark:text-red-400 text-sm font-medium mt-1 flex items-center gap-1 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.user_id}
                                    </p>
                                )}
                            </div>

                            {/* Financial Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { field: "cash_balance", required: true },
                                    { field: "invested_amount", required: false },
                                    { field: "total_portfolio_value", required: false },
                                    { field: "total_pnl", required: false }
                                ].map(({ field, required }) => (
                                    <div key={field} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                            {formatLabel(field)}
                                            {required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 dark:text-gray-400">RF</span>
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data[field as keyof FormData]}
                                                onChange={handleInputChange(field as keyof FormData)}
                                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200 py-3 px-4 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10"
                                                placeholder="0.00"
                                                required={required}
                                            />
                                        </div>
                                        {errors[field as keyof FormData] && (
                                            <p className="text-red-600 dark:text-red-400 text-sm font-medium mt-1 flex items-center gap-1 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors[field as keyof FormData]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Summary Preview Card */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 transition-colors">
                                        Balance Summary
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-blue-700 dark:text-blue-400 transition-colors">Total Assets:</div>
                                    <div className="text-right font-semibold text-blue-900 dark:text-blue-300 transition-colors">
                                        RF{(cashBalance + investedAmount).toLocaleString()}
                                    </div>

                                    <div className="text-blue-700 dark:text-blue-400 transition-colors">Portfolio Value:</div>
                                    <div className="text-right font-semibold text-blue-900 dark:text-blue-300 transition-colors">
                                        RF{portfolioValue.toLocaleString()}
                                    </div>

                                    <div className="text-blue-700 dark:text-blue-400 transition-colors">Profit & Loss:</div>
                                    <div className={`text-right font-semibold transition-colors ${totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        RF{totalPnl.toLocaleString()}
                                    </div>

                                    <div className="text-blue-700 dark:text-blue-400 transition-colors">Net Worth:</div>
                                    <div className={`text-right font-semibold transition-colors ${(cashBalance + portfolioValue) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        RF{(cashBalance + portfolioValue).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
                                <Link
                                    href="/account-balances"
                                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 border border-transparent rounded-lg hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Create Account Balance
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
                                <p className="font-medium mb-1">About Account Balances</p>
                                <p>Account balances track a user's financial position including cash, investments, and overall portfolio performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}