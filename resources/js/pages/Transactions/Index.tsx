import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Eye, Trash2 } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Transaction List", href: "/transactions" }
];

const getTypeBadgeColor = (type: string) => {
  const colors: Record<string, { light: string; dark: string }> = {
    deposit: {
      light: "bg-green-100 text-green-800",
      dark: "bg-green-900/30 text-green-300"
    },
    withdrawal: {
      light: "bg-yellow-100 text-yellow-800",
      dark: "bg-yellow-900/30 text-yellow-300"
    },
    buy: {
      light: "bg-blue-100 text-blue-800",
      dark: "bg-blue-900/30 text-blue-300"
    },
    sell: {
      light: "bg-purple-100 text-purple-800",
      dark: "bg-purple-900/30 text-purple-300"
    },
    dividend: {
      light: "bg-gray-100 text-gray-800",
      dark: "bg-gray-700 text-gray-300"
    },
  };
  
  const colorSet = colors[type] || {
    light: "bg-gray-100 text-gray-800",
    dark: "bg-gray-700 text-gray-300"
  };
  
  return `${colorSet.light} dark:${colorSet.dark}`;
};

export default function TransactionList() {
  const { flash }: any = usePage().props;

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.id,
      sortable: true,
      width: "70px"
    },
    {
      name: "Transaction ID",
      selector: (row: any) => row.transaction_id,
      sortable: true,
      width: "150px"
    },
    {
      name: "User",
      selector: (row: any) => row.user?.name || "N/A",
      sortable: true,
    },
    {
      name: "Type",
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase transition-colors ${getTypeBadgeColor(row.type)}`}>
          {row.type}
        </span>
      ),
      sortable: true,
      width: "120px"
    },
    {
      name: "Amount",
      selector: (row: any) => `${parseFloat(row.amount).toFixed(2)}`,
      sortable: true,
      right: true,
      width: "120px"
    },
    {
      name: "Company",
      selector: (row: any) => row.order?.company?.name || "-",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row: any) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
      width: "110px"
    },
    {
      name: "Actions",
      cell: (row: any, reloadData: () => void) => (
        <div className="flex gap-2">
          <Link
            href={`/transactions/${row.id}`}
            className="p-2 rounded bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
          {(row.type === 'deposit' || row.type === 'withdrawal') && (
            <DeleteConfirm
              id={row.id}
              url={`/transactions/${row.id}`}
              onSuccess={reloadData}
            />
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "120px"
    },
  ];

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Transaction ID", key: "transaction_id" },
    { label: "User", key: "user.name" },
    { label: "Type", key: "type" },
    { label: "Amount", key: "amount" },
    { label: "Description", key: "description" },
    { label: "Date", key: "created_at" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Transactions" />

      {flash?.success && (
        <div className="mb-3 rounded bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900/30 dark:text-green-300 transition-colors">
          {flash.success}
        </div>
      )}
      {flash?.error && (
        <div className="mb-3 rounded bg-red-100 px-4 py-2 text-red-800 dark:bg-red-900/30 dark:text-red-300 transition-colors">
          {flash.error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 transition-colors">
        <div className="p-4 border-b dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-semibold dark:text-white transition-colors">
            All Transactions
          </h2>
        </div>

        <DataTableWrapper
          fetchUrl="/transactions-data"
          columns={columns}
          csvHeaders={csvHeaders}
          createUrl={undefined}
          createLabel={undefined}
        />
      </div>
    </AppLayout>
  );
}