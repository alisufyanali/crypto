import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  type: 'buy' | 'sell';
  quantity: number;
  price_per_share: number;
  total_amount: number;
  status: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  company: {
    id: number;
    name: string;
    symbol: string;
  };
}

interface Stats {
  todayOrders: number;
  totalClients: number;
  pendingKyc: number;
  pendingOrdersCount: number;
}

interface Stock {
  id: number;
  name: string;
  symbol: string;
  current_stock: {
    current_price: number;
    change_amount: number;
    change_percentage: number;
  } | null;
}

interface Props {
  pendingOrders: Order[];
  stats: Stats;
  topStocks: Stock[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];


export default function BrokerDashboard({ pendingOrders, stats, topStocks }: Props) {
  const [processingOrder, setProcessingOrder] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

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


  const handleApproveOrder = (orderId: number) => {
    setProcessingOrder(orderId);
    router.post(`/orders/${orderId}/approve`, {}, {
      onSuccess: () => {
        setProcessingOrder(null);
      },
      onError: () => {
        setProcessingOrder(null);
      },
    });
  };

  const handleRejectOrder = (orderId: number) => {
    if (!rejectNotes.trim()) {
      return;
    }

    setProcessingOrder(orderId);
    router.post(`/orders/${orderId}/reject`, {
      notes: rejectNotes
    }, {
      onSuccess: () => {
        setProcessingOrder(null);
        setShowRejectModal(null);
        setRejectNotes('');
      },
      onError: () => {
        setProcessingOrder(null);
      },
    });
  };

  const handleExecuteOrder = (orderId: number) => {
    if (confirm('Are you sure you want to execute this order? This action cannot be undone.')) {
      setProcessingOrder(orderId);
      router.post(`/orders/${orderId}/execute`, {}, {
        onSuccess: () => {
          setProcessingOrder(null);
        },
        onError: () => {
          setProcessingOrder(null);
        },
      });
    }
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashoard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Stock Overview</h2>
              </div>

              <div className="p-6">
                {topStocks.length > 0 ? (
                  <div className="space-y-4">
                    {topStocks.map((stock) => (
                      <div key={stock.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {stock.current_stock ? formatCurrency(stock.current_stock.current_price) : 'N/A'}
                          </div>
                          {stock.current_stock && (
                            <div className={`text-sm ${stock.current_stock.change_amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {formatPercentage(stock.current_stock.change_percentage)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No stock data available</p>
                  </div>
                )}
              </div>
            </div>

          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>

              <div className="p-6 space-y-3">
                <Link
                  href="/orders?status=pending"
                  className="block w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-center py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Review Pending Orders ({stats.pendingOrdersCount})
                </Link>

                <Link
                  href="/clients?kyc_status=pending"
                  className="block w-full bg-orange-100 hover:bg-orange-200 text-orange-800 text-center py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Review KYC Documents ({stats.pendingKyc})
                </Link>

                <Link
                  href="/company/create"
                  className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-center py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Add New Company
                </Link>

                <Link
                  href="/reports"
                  className="block w-full bg-purple-100 hover:bg-purple-200 text-purple-800 text-center py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Generate Reports
                </Link>
              </div>
            </div>


          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">

            {/* System Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Exchange Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Online
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Price Update</span>
                    <span className="text-sm text-gray-900">
                      {new Date().toLocaleTimeString('en-RW', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="text-sm text-gray-900">{stats.totalClients}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Pending Orders</h2>
                <Link
                  href="/orders"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  View All Orders
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              {pendingOrders.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>

                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.company.name} ({order.company.symbol})
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.quantity.toLocaleString()} shares @ {formatCurrency(order.price_per_share)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              #{order.order_number}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                          <div className="text-sm text-gray-500">{order.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString('en-RW', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleApproveOrder(order.id)}
                              disabled={processingOrder === order.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50 p-1"
                              title="Approve Order"
                            >
                              {processingOrder === order.id ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setShowRejectModal(order.id)}
                              disabled={processingOrder === order.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                              title="Reject Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending orders</h3>
                  <p className="mt-1 text-sm text-gray-500">All orders have been processed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 