import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Company {
    id: number;
    symbol: string;
    name: string;
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
    user: User;
    company: Company;
}

interface PortfolioData {
    data: PortfolioItem[];
    links: any[];
    from: number;
    to: number;
    total: number;
}

interface AdminViewProps {
    auth: any;
    portfolios: PortfolioData;
    users: User[];
    companies: Company[];
    filters: Record<string, any>;
}

interface BalanceFormData {
    amount: string;
    type: 'deposit' | 'withdrawal';
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Portfolio',
        href: '/portfolio',
    }
];

export default function AdminView({ auth, portfolios, users, companies, filters }: AdminViewProps) {
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<BalanceFormData>({
        amount: '',
        type: 'deposit',
    });

    const formatCurrency = (amount: number | undefined | null): string => {
        if (amount === undefined || amount === null) return '0';
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return '0';
        return value.toLocaleString();
    };

    const formatPercentage = (value: number | undefined | null): React.ReactNode => {
        if (value === undefined || value === null) return <span className="text-gray-500">0%</span>;

        const color = value >= 0 ? 'text-green-600' : 'text-red-600';
        const sign = value >= 0 ? '+' : '';
        return (
            <span className={`${color} font-medium`}>
                {sign}{value.toFixed(2)}%
            </span>
        );
    };

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const filters = {
            user_id: formData.get('user_id'),
            company_id: formData.get('company_id'),
        };
        router.get(route('portfolio.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route('portfolio.index'));
    };

    const openBalanceModal = (user: User) => {
        setSelectedUser(user);
        setShowBalanceModal(true);
        reset();
    };

    const closeBalanceModal = () => {
        setShowBalanceModal(false);
        setSelectedUser(null);
        reset();
    };

    const handleBalanceUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        post(route('users.update-balance', selectedUser.id), {
            onSuccess: () => {
                closeBalanceModal();
            },
        });
    };

    const getCurrentPrice = (company: Company): number => {
        return company.current_stock?.current_price || 0;
    };

    const calculateTotalPnl = (item: PortfolioItem): number => {
        return (item.unrealized_pnl || 0) + (item.realized_pnl || 0);
    };

    const calculatePnlPercentage = (item: PortfolioItem): number => {
        const totalPnl = calculateTotalPnl(item);
        const totalInvested = item.total_invested || 0;

        if (totalInvested > 0) {
            return (totalPnl / totalInvested) * 100;
        }
        return 0;
    };

    // Safe data access with fallbacks
    const safePortfolios = portfolios?.data || [];
    const safeUsers = users || [];
    const safeCompanies = companies || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Portfolios - Admin" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Manage and monitor all user portfolios in one place
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {portfolios?.total || 0}
                                            </div>
                                            <div className="text-xs text-gray-500">Total Records</div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300"></div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {safeUsers.length}
                                            </div>
                                            <div className="text-xs text-gray-500">Users</div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300"></div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {safeCompanies.length}
                                            </div>
                                            <div className="text-xs text-gray-500">Companies</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        User
                                    </label>
                                    <select
                                        name="user_id"
                                        defaultValue={filters?.user_id || ''}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    >
                                        <option value="">All Users</option>
                                        {safeUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company
                                    </label>
                                    <select
                                        name="company_id"
                                        defaultValue={filters?.company_id || ''}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    >
                                        <option value="">All Companies</option>
                                        {safeCompanies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.symbol} - {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium shadow-sm"
                                    >
                                        Apply Filters
                                    </button>
                                    {(filters?.user_id || filters?.company_id) && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Portfolio Holdings</h2>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Qty
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Avg Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Current
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Invested
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Current Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            P&L
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {safePortfolios.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-lg font-medium mb-2">No portfolio data found</p>
                                                    <p className="text-sm">Try adjusting your filters or check back later</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        safePortfolios.map((item) => {
                                            const totalPnl = calculateTotalPnl(item);
                                            const pnlPercentage = calculatePnlPercentage(item);
                                            const currentPrice = getCurrentPrice(item.company);

                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                <span className="text-indigo-600 font-semibold text-sm">
                                                                    {item.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item.user?.name || 'Unknown User'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {item.user?.email || 'No email'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.company?.name || 'Unknown Company'}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-mono">
                                                            {item.company?.symbol || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {formatNumber(item.quantity)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(item.average_price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(currentPrice)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {formatCurrency(item.total_invested)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {formatCurrency(item.current_value)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`text-sm font-semibold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {formatCurrency(totalPnl)}
                                                        </div>
                                                        <div className="text-xs">
                                                            {formatPercentage(pnlPercentage)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => item.user && openBalanceModal(item.user)}
                                                            disabled={!item.user}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Update Balance
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {portfolios?.links && portfolios.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-semibold">{portfolios.from || 0}</span> to <span className="font-semibold">{portfolios.to || 0}</span> of{' '}
                                        <span className="font-semibold">{portfolios.total || 0}</span> results
                                    </div>
                                    <div className="flex gap-1">
                                        {portfolios.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${link.active
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Balance Update Modal */}
            {showBalanceModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Update Balance
                                </h3>
                                <button
                                    onClick={closeBalanceModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">User</div>
                                <div className="font-semibold text-gray-900">{selectedUser?.name}</div>
                                <div className="text-sm text-gray-500">{selectedUser?.email}</div>
                            </div>

                            <form onSubmit={handleBalanceUpdate}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Transaction Type
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as 'deposit' | 'withdrawal')}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        >
                                            <option value="deposit">Deposit</option>
                                            <option value="withdrawal">Withdrawal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount (PKR)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                            placeholder="Enter amount"
                                        />
                                        {errors.amount && (
                                            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={closeBalanceModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            'Update Balance'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}