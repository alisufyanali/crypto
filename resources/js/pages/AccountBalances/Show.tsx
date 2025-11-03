import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AccountBalance {
    id: number;
    user_id: number;
    cash_balance: number;
    invested_amount: number;
    total_portfolio_value: number;
    total_pnl: number;
    created_at: string;
    updated_at: string;
    user?: User;
}

interface PageProps {
    account_balance: AccountBalance;
}

export default function ShowAccountBalance() {
    const { account_balance }: PageProps = usePage().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Account Balances", href: "/account-balances" },
        { title: `Balance #${account_balance.id}`, href: `/account-balances/${account_balance.id}` },
    ];

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPnlColor = (value: number): string => {
        return value >= 0 ? 'text-green-600' : 'text-red-600';
    };

    const getPnlBgColor = (value: number): string => {
        return value >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    };

    // Calculate derived values
    const totalAssets = account_balance.cash_balance + account_balance.invested_amount;
    const netWorth = account_balance.cash_balance + account_balance.total_portfolio_value;
    const pnlPercentage = account_balance.invested_amount > 0 
        ? (account_balance.total_pnl / account_balance.invested_amount) * 100 
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Account Balance #${account_balance.id}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Account Balance</h1>
                                    <p className="text-gray-600 mt-1">
                                        {account_balance.user?.name ? `Viewing balance for ${account_balance.user.name}` : 'Account balance details'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
                                <div className="text-sm text-gray-500">Balance ID</div>
                                <div className="text-lg font-bold text-gray-900">#{account_balance.id}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* User Information Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        User Information
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {account_balance.user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {account_balance.user?.name || 'No User Assigned'}
                                            </h3>
                                            <p className="text-gray-600">
                                                {account_balance.user?.email || 'No email available'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                User ID: {account_balance.user_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Financial Details
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Cash Balance</label>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {formatCurrency(account_balance.cash_balance)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Invested Amount</label>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {formatCurrency(account_balance.invested_amount)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Portfolio Value</label>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {formatCurrency(account_balance.total_portfolio_value)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Total P&L</label>
                                                <div className={`text-2xl font-bold ${getPnlColor(account_balance.total_pnl)}`}>
                                                    {formatCurrency(account_balance.total_pnl)}
                                                </div>
                                                <div className={`text-sm font-medium ${getPnlColor(pnlPercentage)}`}>
                                                    {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                    <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Total Assets</label>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(totalAssets)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Net Worth</label>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(netWorth)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Return on Investment</label>
                                        <div className={`text-lg font-semibold ${getPnlColor(pnlPercentage)}`}>
                                            {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                    <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                                        <p className="text-sm text-gray-900">
                                            {formatDate(account_balance.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                                        <p className="text-sm text-gray-900">
                                            {formatDate(account_balance.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                    <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Link
                                        href={`/account-balances/${account_balance.id}/edit`}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Balance
                                    </Link>
                                    <Link
                                        href="/account-balances"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to List
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}