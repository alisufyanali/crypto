import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Portfolio {
  id: number;
  shares_owned: number;
  average_cost: number;
  total_invested: number;
  current_value: number;
  unrealized_pnl: number;
  realized_pnl: number;
  company: {
    id: number;
    name: string;
    symbol: string;
    current_stock: {
      current_price: number;
      change_amount: number;
      change_percentage: number;
    };
  };
}

interface Order {
  id: number;
  order_number: string;
  type: 'buy' | 'sell';
  quantity: number;
  price_per_share: number;
  total_amount: number;
  status: string;
  created_at: string;
  company: {
    name: string;
    symbol: string;
  };
}

interface Props {
  portfolio: Portfolio[];
  accountBalance: {
    cash_balance: number;
    total_portfolio_value: number;
    total_pnl: number;
  };
  recentOrders: Order[];
  totalPortfolioValue: number;
  totalPnl: number;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  }
];


export default function ClientDashboard({
  portfolio,
  accountBalance,
  recentOrders,
  totalPortfolioValue,
  totalPnl,
  kycStatus
}: Props) {
  const totalAccountValue = accountBalance.cash_balance + totalPortfolioValue;
  const pnlPercentage = totalPortfolioValue > 0 ? (totalPnl / totalPortfolioValue) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const formatPercentage = (percentage: any) => {
    const num = Number(percentage) || 0; // string ho to number banayega, agar NaN ho to 0 le lega
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
      case 'executed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'executed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
                <p className="text-gray-600">Welcome back to Rwanda Stock Exchange</p>
              </div>

              {kycStatus !== 'approved' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        KYC Status: {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                      </p>
                      <p className="text-xs text-yellow-600">
                        {kycStatus === 'pending' ? 'Your documents are under review' : 'Please resubmit your documents'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Account Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAccountValue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PieChart className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPortfolioValue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${totalPnl >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {totalPnl >= 0 ?
                    <TrendingUp className="w-6 h-6 text-green-600" /> :
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  }
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalPnl)}
                  </p>
                  <p className={`text-sm ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(pnlPercentage)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cash Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(accountBalance.cash_balance)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Holdings */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Holdings</h2>
                    <Link
                      href="/orders"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Order
                    </Link>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {portfolio.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Shares
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg Cost
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            P&L
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {portfolio.map((holding) => {
                          const currentPrice = holding.company.current_stock?.current_price || 0;
                          const pnl = holding.unrealized_pnl + holding.realized_pnl;
                          const pnlPercentage = holding.total_invested > 0 ? (pnl / holding.total_invested) * 100 : 0;

                          return (
                            <tr key={holding.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {holding.company.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {holding.company.symbol}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {holding.shares_owned.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(holding.average_cost)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatCurrency(currentPrice)}</div>
                                {holding.company.current_stock && (
                                  <div className={`text-xs ${holding.company.current_stock.change_amount >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {formatPercentage(holding.company.current_stock.change_percentage)}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(holding.current_value)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(pnl)}
                                </div>
                                <div className={`text-xs ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatPercentage(pnlPercentage)}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12">
                      <PieChart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No holdings yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
                      <div className="mt-6">
                        <Link
                          href="/orders"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Place First Order
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link
                      href="/orders"
                      className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    >
                      View All
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </span>
                          </div>
                          <span className={`text-sm font-medium ${order.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                            {order.type.toUpperCase()}
                          </span>
                        </div>

                        <div className="mb-2">
                          <h3 className="text-sm font-medium text-gray-900">{order.company.name}</h3>
                          <p className="text-sm text-gray-500">{order.company.symbol}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Quantity:</span> {order.quantity.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> {formatCurrency(order.price_per_share)}
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('en-RW', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <Activity className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No recent orders</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                </div>

                <div className="p-6 space-y-4">
                  <Link
                    href="/orders"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Place New Order
                  </Link>

                  <Link
                    href="/portfolio"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    View Full Portfolio
                  </Link>

                  <Link
                    href="/companies"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Browse Stocks
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