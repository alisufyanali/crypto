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
  const colors: Record<string, { light: string; dark: string }> = {
    deposit: {
      light: "bg-green-100 text-green-800 border-green-300",
      dark: "bg-green-900/30 text-green-300 border-green-700"
    },
    withdrawal: {
      light: "bg-yellow-100 text-yellow-800 border-yellow-300",
      dark: "bg-yellow-900/30 text-yellow-300 border-yellow-700"
    },
    buy: {
      light: "bg-blue-100 text-blue-800 border-blue-300",
      dark: "bg-blue-900/30 text-blue-300 border-blue-700"
    },
    sell: {
      light: "bg-purple-100 text-purple-800 border-purple-300",
      dark: "bg-purple-900/30 text-purple-300 border-purple-700"
    },
    dividend: {
      light: "bg-gray-100 text-gray-800 border-gray-300",
      dark: "bg-gray-700 text-gray-300 border-gray-600"
    },
  };
  
  const colorSet = colors[type] || {
    light: "bg-gray-100 text-gray-800 border-gray-300",
    dark: "bg-gray-700 text-gray-300 border-gray-600"
  };
  
  return `${colorSet.light} dark:${colorSet.dark}`;
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/transactions"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Transactions</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{getTypeIcon(transaction.type)}</span>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">Transaction Details</h1>
                  <p className="text-blue-100 dark:text-blue-200 mt-1">ID: {transaction.transaction_id}</p>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-sm text-blue-100 dark:text-blue-200 mb-1">Amount</div>
                <div className="text-2xl lg:text-3xl font-bold">
                  RF {parseFloat(transaction.amount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Type Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase border-2 transition-colors ${getTypeBadgeColor(transaction.type)}`}>
                {transaction.type}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* User Info */}
              {transaction.user && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={20} className="text-gray-600 dark:text-gray-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">User Information</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.user.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Info */}
              {transaction.order?.company && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={20} className="text-gray-600 dark:text-gray-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Company Information</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Company:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.order.company.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Symbol:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.order.company.symbol}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Info */}
              {transaction.order && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Hash size={20} className="text-gray-600 dark:text-gray-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Order Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
                      <p className="font-medium text-gray-900 dark:text-white">#{transaction.order.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.order.quantity} shares</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Price per share:</span>
                      <p className="font-medium text-gray-900 dark:text-white">RF {parseFloat(transaction.order.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Transaction Info</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Updated:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(transaction.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Description</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{transaction.description}</p>
            </div>

            {/* Metadata */}
            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
              <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Additional Information</h3>
                <pre className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-300 dark:border-gray-600 overflow-x-auto text-gray-900 dark:text-gray-300 transition-colors">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Amount Breakdown */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign size={32} className="text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      RF {parseFloat(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
                {transaction.order && (
                  <div className="text-left lg:text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
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