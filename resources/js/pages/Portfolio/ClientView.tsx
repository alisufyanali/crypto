import React from 'react';
import { Head } from '@inertiajs/react';

// Types
interface Company {
    id: number;
    name: string;
    symbol: string;
    current_stock?: {
        current_price: number;
    };
}

interface PortfolioItem {
    id: number;
    quantity: number;
    average_price: number;
    total_invested: number;
    current_value: number;
    unrealized_pnl: number;
    realized_pnl: number;
    company: Company;
}

interface AccountBalance {
    cash_balance: number;
}

interface Summary {
    totalInvested: number;
    currentValue: number;
    totalPnl: number;
    totalPnlPercentage: number;
    cashBalance: number;
    totalAccountValue: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    portfolio: PortfolioItem[];
    accountBalance: AccountBalance;
    summary: Summary;
}

export default function ClientView({ auth, portfolio, accountBalance, summary }: PageProps) {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (value: number): React.ReactNode => {
        const color = value >= 0 ? 'text-green-600' : 'text-red-600';
        const sign = value >= 0 ? '+' : '';
        return (
            <span className={`${color} font-semibold`}>
                {sign}{value.toFixed(2)}%
            </span>
        );
    };

    const getPnlColor = (value: number): string => {
        return value >= 0 ? 'text-green-600' : 'text-red-600';
    };

    const getPnlBgColor = (value: number): string => {
        return value >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    };

    return (
        <>
            <Head title="My Portfolio" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
                                    <p className="text-gray-600 mt-1">Welcome back, {auth.user.name}!</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                                <div className="text-sm text-gray-500">Account Status</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-900">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Account Value */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-2">Total Account Value</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(summary.totalAccountValue)}
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500">Combined value of all assets</div>
                            </div>
                        </div>

                        {/* Cash Balance */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-2">Cash Balance</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(summary.cashBalance)}
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500">Available for trading</div>
                            </div>
                        </div>

                        {/* Invested Amount */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-2">Invested Amount</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(summary.totalInvested)}
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500">Total capital invested</div>
                            </div>
                        </div>

                        {/* Total P&L */}
                        <div className={`rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-300 ${
                            summary.totalPnl >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-2">Total P&L</div>
                                    <div className={`text-2xl font-bold ${getPnlColor(summary.totalPnl)}`}>
                                        {formatCurrency(summary.totalPnl)}
                                    </div>
                                    <div className="text-sm font-semibold mt-1">
                                        {formatPercentage(summary.totalPnlPercentage)}
                                    </div>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    summary.totalPnl >= 0 ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    {summary.totalPnl >= 0 ? (
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-opacity-50" style={{
                                borderColor: summary.totalPnl >= 0 ? 'rgb(187 247 208)' : 'rgb(254 202 202)'
                            }}>
                                <div className="text-xs text-gray-500">Overall return on investment</div>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Holdings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">My Holdings</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {portfolio.length} holding{portfolio.length !== 1 ? 's' : ''} in your portfolio
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0">
                                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        Total Value: {formatCurrency(summary.currentValue)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Qty
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Avg Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Current
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Invested
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Current Value
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            P&L
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {portfolio.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No holdings yet</h3>
                                                    <p className="text-gray-600 max-w-sm">
                                                        Start building your portfolio by making your first investment.
                                                    </p>
                                                    <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                                        Start Investing
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        portfolio.map((item) => {
                                            const totalPnl = item.unrealized_pnl + item.realized_pnl;
                                            const pnlPercentage = item.total_invested > 0
                                                ? (totalPnl / item.total_invested) * 100
                                                : 0;

                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                                {item.company.symbol.substring(0, 2)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {item.company.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 font-mono">
                                                                    {item.company.symbol}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                                                            {item.quantity.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {formatCurrency(item.average_price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {formatCurrency(item.company.current_stock?.current_price || 0)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatCurrency(item.total_invested)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatCurrency(item.current_value)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`text-sm font-bold ${getPnlColor(totalPnl)}`}>
                                                            {formatCurrency(totalPnl)}
                                                        </div>
                                                        <div className="text-xs font-medium">
                                                            {formatPercentage(pnlPercentage)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Portfolio Summary Footer */}
                        {portfolio.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing <span className="font-semibold">{portfolio.length}</span> holding{portfolio.length !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-gray-600">
                                            Total Invested: <span className="font-semibold text-gray-900">{formatCurrency(summary.totalInvested)}</span>
                                        </div>
                                        <div className="text-gray-600">
                                            Current Value: <span className="font-semibold text-gray-900">{formatCurrency(summary.currentValue)}</span>
                                        </div>
                                        <div className={`font-semibold ${getPnlColor(summary.totalPnl)}`}>
                                            Total P&L: {formatCurrency(summary.totalPnl)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}