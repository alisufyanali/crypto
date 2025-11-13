import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
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
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import * as Chart from 'chart.js';

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
  const chartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart.Chart | null>(null);
  const barChartInstance = useRef<Chart.Chart | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: any) => {
    const num = Number(percentage) || 0;
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const handleApproveOrder = (orderId: number) => {
    setProcessingOrder(orderId);
    router.post(
      `/orders/${orderId}/approve`,
      {},
      {
        onSuccess: () => {
          setProcessingOrder(null);
        },
        onError: () => {
          setProcessingOrder(null);
        },
      }
    );
  };

  const handleRejectOrder = (orderId: number) => {
    if (!rejectNotes.trim()) return;
    setProcessingOrder(orderId);
    router.post(
      `/orders/${orderId}/reject`,
      { notes: rejectNotes },
      {
        onSuccess: () => {
          setProcessingOrder(null);
          setShowRejectModal(null);
          setRejectNotes('');
        },
        onError: () => {
          setProcessingOrder(null);
        },
      }
    );
  };

  // Chart initialization with dark mode support
  useEffect(() => {
    Chart.Chart.register(...Chart.registerables);

    // Common colors for light and dark mode
    const getChartColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        textColor: isDark ? '#9CA3AF' : '#6B7280',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        tooltipBg: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        tooltipText: isDark ? '#1F2937' : '#FFFFFF',
      };
    };

    // Area Chart for Revenue vs Expenses
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const colors = getChartColors();
        
        chartInstance.current = new Chart.Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Revenue',
                data: [65, 75, 70, 80, 75, 85, 90, 95, 100, 110, 120, 130],
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
              },
              {
                label: 'Expenses',
                data: [45, 55, 50, 60, 55, 65, 70, 75, 80, 85, 90, 95],
                fill: true,
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: colors.tooltipBg,
                titleColor: colors.tooltipText,
                bodyColor: colors.tooltipText,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
              }
            },
            scales: {
              x: {
                display: true,
                grid: {
                  display: false,
                },
                ticks: {
                  color: colors.textColor
                }
              },
              y: {
                display: true,
                grid: {
                  color: colors.gridColor,
                },
                ticks: {
                  color: colors.textColor
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            }
          }
        });
      }
    }

    // Bar Chart for Weekly Sales
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        if (barChartInstance.current) {
          barChartInstance.current.destroy();
        }

        const colors = getChartColors();

        barChartInstance.current = new Chart.Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Sales',
              data: [12, 25, 35, 58, 45, 20, 38],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(59, 130, 246, 1)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(59, 130, 246, 0.8)'
              ],
              borderRadius: 4,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: colors.tooltipBg,
                titleColor: colors.tooltipText,
                bodyColor: colors.tooltipText,
              }
            },
            scales: {
              x: {
                display: true,
                grid: {
                  display: false,
                },
                ticks: {
                  color: colors.textColor
                }
              },
              y: {
                display: true,
                grid: {
                  color: colors.gridColor,
                },
                ticks: {
                  color: colors.textColor
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="m-5">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Broker Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor and manage your trading operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today Orders */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90">Today's Orders</h3>
            <p className="text-3xl font-bold">{stats.todayOrders}</p>
          </div>

          {/* Total Clients */}
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90">Total Clients</h3>
            <p className="text-3xl font-bold">{stats.totalClients}</p>
          </div>

          {/* Pending KYC */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90">Pending KYC</h3>
            <p className="text-3xl font-bold">{stats.pendingKyc}</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90">Pending Orders</h3>
            <p className="text-3xl font-bold">{stats.pendingOrdersCount}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Records</h2>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">RF 190,090.36</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-80">
                <canvas ref={chartRef}></canvas>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-8 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                <div className="bg-blue-600 rounded-lg p-3 text-white">
                  <div className="text-xs opacity-80">This Month</div>
                  <div className="text-lg font-semibold">RF 1,342</div>
                </div>
                <div className="bg-cyan-500 rounded-lg p-3 text-white">
                  <div className="text-xs opacity-80">Last Month</div>
                  <div className="text-lg font-semibold">RF 1,342</div>
                </div>
                <div className="bg-purple-500 rounded-lg p-3 text-white">
                  <div className="text-xs opacity-80">This Year</div>
                  <div className="text-lg font-semibold">142</div>
                </div>
                <div className="bg-pink-500 rounded-lg p-3 text-white">
                  <div className="text-xs opacity-80">Last Year</div>
                  <div className="text-lg font-semibold">RF 13</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Total Sales</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">September 2025</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">RF 30,567</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-48">
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Overview & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Stock Overview</h2>
            </div>
            <div className="p-6">
              {topStocks && topStocks.length > 0 ? (
                <div className="space-y-4">
                  {topStocks.map((stock) => (
                    <div key={stock.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {stock.current_stock ? formatCurrency(stock.current_stock.current_price) : 'N/A'}
                        </div>
                        {stock.current_stock && (
                          <div className={`text-sm flex items-center justify-end ${stock.current_stock.change_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.current_stock.change_amount >= 0 ? (
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 mr-1" />
                            )}
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
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No stock data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href="/orders?status=pending"
                className="block w-full bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 text-center py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Review Pending Orders ({stats.pendingOrdersCount})
              </Link>

              <Link
                href="/clients?kyc_status=pending"
                className="block w-full bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-center py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Review KYC Documents ({stats.pendingKyc})
              </Link>

              <Link
                href="/company/create"
                className="block w-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-center py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Add New Company
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Orders</h2>
              <Link
                href="/orders"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                View All Orders
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            {pendingOrders && pendingOrders.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                              {order.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.company.name} ({order.company.symbol})
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.quantity.toLocaleString()} shares @ {formatCurrency(order.price_per_share)}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            #{order.order_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(order.total_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending orders</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All orders have been processed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reject Order</h3>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={4}
                placeholder="Enter rejection reason..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectOrder(showRejectModal)}
                  disabled={!rejectNotes.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Reject Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}