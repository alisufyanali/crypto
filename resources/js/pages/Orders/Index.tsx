import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Eye, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Trash } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Orders", href: "/orders" }
];

interface Company {
  id: number;
  name: string;
  symbol: string;
}

interface Props {
  companies: Company[];
  isClient: boolean;
}

export default function OrdersIndex({ companies, isClient }: Props) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add this for forcing refresh

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleApprove = (orderId: number) => {
    setProcessing(true);
    router.post(`/orders/${orderId}/approve`, {}, {
      onSuccess: () => {
        setShowApproveModal(false);
        setSelectedOrder(null);
        setProcessing(false);
        setRefreshKey(prev => prev + 1); // Force refresh
      },
      onError: () => {
        setProcessing(false);
      }
    });
  };

  const handleReject = (orderId: number) => {
    if (!rejectNotes.trim()) {
      alert("Please provide rejection notes");
      return;
    }

    setProcessing(true);
    router.post(`/orders/${orderId}/reject`, { notes: rejectNotes }, {
      onSuccess: () => {
        setShowRejectModal(false);
        setSelectedOrder(null);
        setRejectNotes("");
        setProcessing(false);
        setRefreshKey(prev => prev + 1); // Force refresh
      },
      onError: () => {
        setProcessing(false);
      }
    });
  };

  const handleExecute = (orderId: number) => {
    setProcessing(true);
    router.post(`/orders/${orderId}/execute`, {}, {
      onSuccess: () => {
        setShowExecuteModal(false);
        setSelectedOrder(null);
        setProcessing(false);
        setRefreshKey(prev => prev + 1); // Force refresh
      },
      onError: () => {
        setProcessing(false);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      executed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const isBuy = type === 'buy';
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isBuy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
        {isBuy ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.id,
      sortable: true,
      width: "7%"
    },
    ...(isClient ? [] : [{
      name: "Client",
      selector: (row: any) => row.user?.name || 'N/A',
      sortable: true,
      width: "15%",
      cell: (row: any) => (
        <div>
          <div className="font-medium text-gray-900">{row.user?.name}</div>
          <div className="text-xs text-gray-500">{row.user?.email}</div>
        </div>
      )
    }]),
    {
      name: "Company",
      selector: (row: any) => row.company?.name || 'N/A',
      sortable: true,
      width: isClient ? "20%" : "15%",
      cell: (row: any) => (
        <div>
          <div className="font-medium text-gray-900">{row.company?.name}</div>
          <div className="text-xs text-gray-500">{row.company?.symbol}</div>
        </div>
      )
    },
    {
      name: "Type",
      selector: (row: any) => row.type,
      sortable: true,
      width: "10%",
      cell: (row: any) => getTypeBadge(row.type)
    },
    {
      name: "Quantity",
      selector: (row: any) => row.quantity,
      sortable: true,
      width: "10%",
      cell: (row: any) => (
        <span className="font-medium">{row.quantity.toLocaleString()}</span>
      )
    },
    {
      name: "Price",
      selector: (row: any) => row.price_per_share,
      sortable: true,
      width: "12%",
      cell: (row: any) => formatCurrency(row.price_per_share)
    },
    {
      name: "Total",
      selector: (row: any) => row.total_amount,
      sortable: true,
      width: "12%",
      cell: (row: any) => (
        <span className="font-semibold">{formatCurrency(row.total_amount)}</span>
      )
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      sortable: true,
      width: "12%",
      cell: (row: any) => getStatusBadge(row.status)
    },
    {
      name: "Actions",
      cell: (row: any, reloadData: () => void) => (
        <div className="flex gap-2">
          {/* View */}
          <Link
            href={`/orders/${row.id}`}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </Link>

          {/* Admin/Broker Actions */}
          {!isClient && (
            <>
              {/* Approve */}
              {row.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedOrder(row);
                    setShowApproveModal(true);
                  }}
                  className="p-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                  title="Approve Order"
                >
                  <CheckCircle size={16} />
                </button>
              )}

              {/* Reject */}
              {row.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedOrder(row);
                    setShowRejectModal(true);
                  }}
                  className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Reject Order"
                >
                  <XCircle size={16} />
                </button>
              )}

              {/* Execute */}
              {row.status === 'approved' && (
                <button
                  onClick={() => {
                    setSelectedOrder(row);
                    setShowExecuteModal(true);
                  }}
                  className="p-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                  title="Execute Order"
                >
                  <CheckCircle size={16} />
                </button>
              )}
            </>
          )}

          {/* Delete (only pending orders) */}
          {row.status === 'pending' && (
            <DeleteConfirm id={row.id} url={`/orders/${row.id}`} onSuccess={reloadData} />
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: isClient ? "12%" : "14%"
    },
  ];

  const csvHeaders = [
    ...(isClient ? [] : [
      { label: "Client", key: "user.name" },
      { label: "Email", key: "user.email" }
    ]),
    { label: "ID", key: "id" },
    { label: "Company", key: "company.name" },
    { label: "Symbol", key: "company.symbol" },
    { label: "Type", key: "type" },
    { label: "Quantity", key: "quantity" },
    { label: "Price per Share", key: "price_per_share" },
    { label: "Total Amount", key: "total_amount" },
    { label: "Status", key: "status" },
  ];

  // Additional filters for admins/brokers
  const additionalFilters = !isClient ? [
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'executed', label: 'Executed' },
        { value: 'rejected', label: 'Rejected' },
      ]
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Types' },
        { value: 'buy', label: 'Buy' },
        { value: 'sell', label: 'Sell' },
      ]
    },
    {
      name: 'company_id',
      label: 'Company',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Companies' },
        ...companies.map(c => ({ value: c.id.toString(), label: `${c.name} (${c.symbol})` }))
      ]
    }
  ] : [
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'executed', label: 'Executed' },
        { value: 'rejected', label: 'Rejected' },
      ]
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Types' },
        { value: 'buy', label: 'Buy' },
        { value: 'sell', label: 'Sell' },
      ]
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Orders" />

      <DataTableWrapper
        key={refreshKey} // Add this key prop
        fetchUrl="/orders/data"
        columns={columns}
        csvHeaders={csvHeaders}
        createUrl="/orders/create"
        createLabel="+ Place New Order"
        additionalFilters={additionalFilters}
      />
     

      {/* Approve Modal */}
      {showApproveModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Approve Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this {selectedOrder.type} order for{' '}
              <strong>{selectedOrder.quantity}</strong> shares of{' '}
              <strong>{selectedOrder.company?.name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedOrder.id)}
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
      {showRejectModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Order</h3>
            <p className="text-gray-600 mb-4">
              Rejecting {selectedOrder.type} order for{' '}
              <strong>{selectedOrder.quantity}</strong> shares of{' '}
              <strong>{selectedOrder.company?.name}</strong>
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
                  setSelectedOrder(null);
                  setRejectNotes("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedOrder.id)}
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
      {showExecuteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Execute Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to execute this {selectedOrder.type} order for{' '}
              <strong>{selectedOrder.quantity}</strong> shares of{' '}
              <strong>{selectedOrder.company?.name}</strong>?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. The order will be processed
                and portfolio/balance will be updated immediately.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowExecuteModal(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecute(selectedOrder.id)}
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