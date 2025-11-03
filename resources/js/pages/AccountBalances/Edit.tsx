import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState, FormEvent, ChangeEvent } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AccountBalance {
    id: number;
    user_id: number | null;
    cash_balance: number;
    invested_amount: number;
    total_portfolio_value: number;
    total_pnl: number;
    user?: User | null;
}

interface EditProps {
    balance: AccountBalance;
    users: User[];
}

interface FormData {
    user_id: string;
    cash_balance: string;
    invested_amount: string;
    total_portfolio_value: string;
    total_pnl: string;
}

export default function Edit({ balance, users }: EditProps) {
    // Safe data initialization with fallbacks
    const { data, setData, put, processing, errors } = useForm<FormData>({
        user_id: balance?.user_id?.toString() || "",
        cash_balance: balance?.cash_balance?.toString() || "0",
        invested_amount: balance?.invested_amount?.toString() || "0",
        total_portfolio_value: balance?.total_portfolio_value?.toString() || "0",
        total_pnl: balance?.total_pnl?.toString() || "0",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/account-balances/${balance.id}`);
    };

    const handleInputChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData(field, e.target.value);
    };

    const formatLabel = (field: string): string => {
        return field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    const fields: (keyof FormData)[] = ["cash_balance", "invested_amount", "total_portfolio_value", "total_pnl"];

    // Safe calculations with fallbacks
    const cashBalance = parseFloat(data.cash_balance || "0");
    const investedAmount = parseFloat(data.invested_amount || "0");
    const portfolioValue = parseFloat(data.total_portfolio_value || "0");

    return (
        <AppLayout>
            <Head title="Edit Account Balance" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Account Balance</h1>
                                <p className="text-gray-600 mt-1">
                                    {balance?.user ? `Editing balance for ${balance.user.name}` : 'Update account balance information'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <h2 className="text-lg font-semibold text-gray-900">Balance Information</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* User Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    User Account *
                                </label>
                                <select
                                    value={data.user_id}
                                    onChange={handleInputChange("user_id")}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-3 px-4 border"
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && (
                                    <p className="text-red-600 text-sm font-medium mt-1 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.user_id}
                                    </p>
                                )}
                            </div>

                            {/* Financial Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {formatLabel(field)}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">₨</span>
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data[field]}
                                                onChange={handleInputChange(field)}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-3 px-4 border pl-10"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors[field] && (
                                            <p className="text-red-600 text-sm font-medium mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors[field]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Summary Card */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-sm font-semibold text-blue-900">Quick Calculation</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-700">Cash + Investments:</span>
                                    </div>
                                    <div className="text-right font-medium text-blue-900">
                                        ₨{(cashBalance + investedAmount).toLocaleString()}
                                    </div>
                                    <div>
                                        <span className="text-blue-700">Portfolio Value:</span>
                                    </div>
                                    <div className="text-right font-medium text-blue-900">
                                        ₨{portfolioValue.toLocaleString()}
                                    </div>
                                    <div>
                                        <span className="text-blue-700">Difference:</span>
                                    </div>
                                    <div className={`text-right font-medium ${
                                        portfolioValue >= (cashBalance + investedAmount) ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        ₨{(portfolioValue - (cashBalance + investedAmount)).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Update Balance
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}