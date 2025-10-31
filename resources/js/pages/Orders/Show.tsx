import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  DollarSign
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Order {
  id: number;
  type: 'buy' | 'sell';
  quantity: number;
  price_per_share: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  notes?: string;
  created_at: string;
  approved_at?: string;
  executed_at?: string;
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
    id: number;
    name: string;
  };
  executed_by?: {
    id: number;
    name: string;
  };
}

interface Props {
  order: Order;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Orders', href: '/orders' },
  { title: 'Order Details', href: '#' }
];

export default function ShowOrder({ order }: Props) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const isClient = order.user.id === (window as any).auth?.user?.id;
  const canApprove = order.status === 'pending' && !isClient;
  const canExecute = order.status === 'approved' && !isClient;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        label: 'Pending Approval'
      },
      approved: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        label: 'Approved'
      },
      executed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        label: 'Executed'
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Rejected'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const handleApprove = () => {
    setProcessing(true);
    router.post(`/orders/${order.id}/approve`, {}, {
      onSuccess: () => {
        setShowApproveModal(false);
        setProcessing(false);
      },
      onError: () => setProcessing(false)
    });
  };

  const handleReject = () => {
    if (!rejectNotes.trim()) {
      alert('Please provide rejection notes');
      return;
    }

    setProcessing(true);
    router.post(`/orders/${order.id}/reject`, { notes: rejectNotes }, {
      onSuccess: () => {
        setShowRejectModal(false);
        setRejectNotes('');
        setProcessing(false);
      },
      onError: () => setProcessing(false)
    });
  };

  const handleExecute = () => {
    setProcessing(true);
    router.post(`/orders/${order.id}/execute`, {}, {
      onSuccess: () => {
        setShowExecuteModal(false);
        setProcessing(false);
      },
      onError: () => setProcessing(false)
    });
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Order #${order.id}`} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center">
                <Link
                  href="/orders"
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                  <p className="text-gray-600">View order details and status</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-2 rounded-lg border-2 ${statusConfig.color} flex items-center gap-2`}>
                <StatusIcon className="w-5 h-5" />
                <span className="font-semibold">{statusConfig.label}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type Card */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
                </div>
                <div className="p-6">
                  <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg ${
                    order.type === 'buy' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                  }`}>
                    {order.type === 'buy' ? (
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    ) : (
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <div className={`text-2xl font-bold ${order.type === 'buy' ? 'text-green-700' : 'text-red-700'}`}>
                        {order.type.charAt(0).toUpperCase() + order.type.slice(1)} Order
                      </div>
                      <div className="text-sm text-gray-600">Order Type</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Company Details
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Company Name:</span>
                    <span className="text-xl font-semibold text-gray-900">{order.company.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Symbol:</span>
                    <span className="text-lg font-medium text-blue-600">{order.company.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Details
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="text-lg font-semibold text-gray-900">{order.quantity.toLocaleString()} shares</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Price per Share:</span>
                    <span className="text-lg font-semibold text-gray-900">{formatCurrency(order.price_per_share)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Client Information (for admin/broker) */}
              {!isClient && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Client Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{order.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{order.user.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes (if rejected) */}
              {order.status === 'rejected' && order.notes && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="px-6 py-4 border-b border-red-200">
                    <h2 className="text-lg font-semibold text-red-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Rejection Notes
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-red-800">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Timeline
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Created */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Order Created</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {/* Approved/Rejected */}
                  {order.approved_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          order.status === 'rejected' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {order.status === 'rejected' ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {order.status === 'rejected' ? 'Order Rejected' : 'Order Approved'}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(order.approved_at)}</p>
                        {order.approved_by && (
                          <p className="text-xs text-gray-500">by {order.approved_by.name}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Executed */}
                  {order.executed_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Order Executed</p>
                        <p className="text-xs text-gray-500">{formatDate(order.executed_at)}</p>
                        {order.executed_by && (
                          <p className="text-xs text-gray-500">by {order.executed_by.name}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions (for admin/broker) */}
              {!isClient && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    {canApprove && (
                      <>
                        <button
                          onClick={() => setShowApproveModal(true)}
                          className="w-full py-2.5 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Approve Order
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="w-full py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} />
                          Reject Order
                        </button>
                      </>
                    )}
                    
                    {canExecute && (
                      <button
                        onClick={() => setShowExecuteModal(true)}
                        className="w-full py-2.5 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Execute Order
                      </button>
                    )}

                    {!canApprove && !canExecute && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No actions available for this order.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Back Button */}
              <Link
                href="/orders"
                className="block w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Approve Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this {order.type} order for{' '}
              <strong>{order.quantity}</strong> shares of <strong>{order.company.name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={processing}
              >
                {processing ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Order</h3>
            <p className="text-gray-600 mb-4">
              Rejecting {order.type} order for <strong>{order.quantity}</strong> shares of{' '}
              <strong>{order.company.name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                placeholder="Please provide reason for rejection..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNotes('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={processing}
              >
                {processing ? 'Rejecting...' : 'Reject Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execute Modal */}
      {showExecuteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Execute Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to execute this {order.type} order for{' '}
              <strong>{order.quantity}</strong> shares of <strong>{order.company.name}</strong>?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. The order will be processed 
                and portfolio/balance will be updated immediately.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowExecuteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleExecute}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                disabled={processing}
              >
                {processing ? 'Executing...' : 'Execute Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}