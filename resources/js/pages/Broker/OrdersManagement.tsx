// Orders Management Component - resources/js/pages/Broker/OrdersManagement.tsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Search,
  Calendar,
  User,
  Building,
  PlayCircle,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  type: 'buy' | 'sell';
  quantity: number;
  price_per_share: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'cancelled';
  created_at: string;
  approved_at: string | null;
  executed_at: string | null;
  notes: string | null;
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
  approved_by?: {
    name: string;
  };
  executed_by?: {
    name: string;
  };
}

interface Props {
  orders: {
    data: Order[];
    links: any[];
    meta: any;
  };
  filters: {
    search?: string;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
  };
  stats: {
    pending: number;
    approved: number;
    executed: number;
    rejected: number;
  };
}

export default function OrdersManagement({ orders, filters, stats }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [processing, setProcessing] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showExecuteModal, setShowExecuteModal] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = () => {
    router.get('/broker/orders', {
      search: searchTerm,
      status: statusFilter,
      type: typeFilter,
      date_from: dateFrom,
      date_to: dateTo,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleApprove = (orderId: number) => {
    setProcessing(orderId);
    router.post(`/orders/${orderId}/approve`, {}, {
      onSuccess: () => setProcessing(null),
      onError: () => setProcessing(null),
    });
  };

  const handleReject = (orderId: number) => {
    if (!rejectNotes.trim()) return;
    
    setProcessing(orderId);
    router.post(`/orders/${orderId}/reject`, {
      notes: rejectNotes
    }, {
      onSuccess: () => {
        setProcessing(null);
        setShowRejectModal(null);
        setRejectNotes('');
      },
      onError: () => setProcessing(null),
    });
  };

  const handleExecute = (orderId: number) => {
    setProcessing(orderId);
    router.post(`/orders/${orderId}/execute`, {}, {
      onSuccess: () => {
        setProcessing(null);
        setShowExecuteModal(null);
      },
      onError: () => setProcessing(null),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'executed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'executed':
        return <PlayCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Head title="Orders Management" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600">Review, approve and execute client orders</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  href="/broker/orders/export"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <PlayCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Executed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.executed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search orders, clients, or companies..."
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="executed">Executed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="buy">Buy Orders</option>
                    <option value="sell">Sell Orders</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Orders ({orders.meta.total} total)
              </h2>
            </div>
            
            <div className="overflow-x-auto">
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
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.data.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            order.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {order.type === 'buy' ? 
                              <TrendingUp className="w-4 h-4 text-green-600" /> : 
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            }
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.type.toUpperCase()} {order.quantity.toLocaleString()} shares
                            </div>
                            <div className="text-sm text-gray-500">
                              @ {formatCurrency(order.price_per_share)}
                            </div>
                            <div className="text-xs text-gray-400">
                              #{order.order_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                            <div className="text-sm text-gray-500">{order.user.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <Building className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{order.company.name}</div>
                            <div className="text-sm text-gray-500">{order.company.symbol}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </span>
                        {order.notes && (
                          <div className="text-xs text-red-600 mt-1 max-w-32 truncate" title={order.notes}>
                            Note: {order.notes}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString('en-RW')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString('en-RW', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        {order.executed_at && (
                          <div className="text-xs text-green-600 mt-1">
                            Executed: {new Date(order.executed_at).toLocaleDateString('en-RW')}
                          </div>
                        )}
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
                          
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(order.id)}
                                disabled={processing === order.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50 p-1"
                                title="Approve Order"
                              >
                                {processing === order.id ? (
                                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setShowRejectModal(order.id)}
                                disabled={processing === order.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                                title="Reject Order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {order.status === 'approved' && (
                            <button
                              onClick={() => setShowExecuteModal(order.id)}
                              disabled={processing === order.id}
                              className="text-purple-600 hover:text-purple-900 disabled:opacity-50 p-1"
                              title="Execute Order"
                            >
                              {processing === order.id ? (
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <PlayCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {orders.data.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {Object.values(filters).some(f => f) 
                      ? 'Try adjusting your filters to see more results.' 
                      : 'No orders have been placed yet.'
                    }
                  </p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {orders.links && orders.data.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Showing {orders.meta.from} to {orders.meta.to} of {orders.meta.total} results
                  </div>
                  <div className="flex space-x-1">
                    {orders.links.map((link: any, index: number) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-3 py-1 text-sm rounded ${
                          link.active 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reject Order</h3>
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <label htmlFor="reject-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection: <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reject-notes"
                  rows={4}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Please provide a clear reason for rejecting this order..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectModal)}
                  disabled={!rejectNotes.trim() || processing === showRejectModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {processing === showRejectModal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Rejecting...
                    </>
                  ) : (
                    'Reject Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execute Confirmation Modal */}
      {showExecuteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Execute Order</h3>
                <button
                  onClick={() => setShowExecuteModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              {(() => {
                const order = orders.data.find(o => o.id === showExecuteModal);
                return order && (
                  <div className="mb-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Confirm Order Execution</h4>
                          <p className="text-xs text-yellow-600 mt-1">
                            This action will execute the order and update the client's portfolio. This cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Client:</span>
                          <div className="text-gray-900">{order.user.name}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Stock:</span>
                          <div className="text-gray-900">{order.company.symbol}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Type:</span>
                          <div className={`font-medium ${order.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                            {order.type.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Quantity:</span>
                          <div className="text-gray-900">{order.quantity.toLocaleString()}</div>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-600">Total Amount:</span>
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(order.total_amount)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExecuteModal(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleExecute(showExecuteModal)}
                  disabled={processing === showExecuteModal}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {processing === showExecuteModal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Executing...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Execute Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}