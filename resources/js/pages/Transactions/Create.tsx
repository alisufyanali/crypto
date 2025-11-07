import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, User, Building2, FileText, DollarSign, Hash } from "lucide-react";

interface Transaction {
  id: number;
  transaction_id: string;
  type: string;
  amount: string;
  description: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  order?: {
    id: number;
    quantity: number;
    price: string;
    company?: {
      id: number;
      name: string;
      symbol: string;
    };
  };
}

interface Props {
  transaction: Transaction;
}

const getTypeBadgeColor = (type: string) => {
  const colors: Record<string, string> = {
    deposit: "bg-green-100 text-green-800 border-green-300",
    withdrawal: "bg-yellow-100 text-yellow-800 border-yellow-300",
    buy: "bg-blue-100 text-blue-800 border-blue-300",
    sell: "bg-purple-100 text-purple-800 border-purple-300",
    dividend: "bg-gray-100 text-gray-800 border-gray-300",
  };
  return colors[type] || "bg-gray-100 text-gray-800 border-gray-300";
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'deposit':
      return '💰';
    case 'withdrawal':
      return '💸';
    case 'buy':
      return '📈';
    case 'sell':
      return '📉';
    case 'dividend':
      return '💵';
    default:
      return '📄';
  }
};

export default function TransactionShow({ transaction }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Transactions", href: "/transactions" },
    { title: `Transaction #${transaction.id}`, href: `/transactions/${transaction.id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Transaction #${transaction.id}`} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/transactions"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span>Back to Transactions</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getTypeIcon(transaction.type)}</span>
                  <h1 className="text-3xl font-bold">Transaction Details</h1>
                </div>
                <p className="text-blue-100">ID: {transaction.transaction_id}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100 mb-1">Amount</div>
                <div className="text-3xl font-bold">
                  RF {parseFloat(transaction.amount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Type Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase border-2 ${getTypeBadgeColor(transaction.type)}`}>
                {transaction.type}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info */}
              {transaction.user && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={20} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">User Information</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <p className="font-medium">{transaction.user.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{transaction.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Info */}
              {transaction.order?.company && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={20} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Company Information</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Company:</span>
                      <p className="font-medium">{transaction.order.company.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Symbol:</span>
                      <p className="font-medium">{transaction.order.company.symbol}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Info */}
              {transaction.order && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Hash size={20} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Order Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <p className="font-medium">#{transaction.order.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <p className="font-medium">{transaction.order.quantity} shares</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Price per share:</span>
                      <p className="font-medium">RF {parseFloat(transaction.order.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Transaction Info</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Created:</span>
                    <p className="font-medium">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Updated:</span>
                    <p className="font-medium">
                      {new Date(transaction.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Description</h3>
              </div>
              <p className="text-gray-700">{transaction.description}</p>
            </div>

            {/* Metadata */}
            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                <pre className="text-sm bg-white p-3 rounded border border-gray-300 overflow-x-auto">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Amount Breakdown */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign size={32} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      RF {parseFloat(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
                {transaction.order && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {transaction.order.quantity} × RF {parseFloat(transaction.order.price).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}