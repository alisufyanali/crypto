import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil, Eye } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Stock List", href: "stocks" }];

export default function StockList() {
  const { flash }: any = usePage().props;

  const columns = [
    { name: "ID", selector: (row: any) => row.id, sortable: true, width: "70px" },
    { name: "Company", selector: (row: any) => row.company_name, sortable: true },
    { name: "Current Price", selector: (row: any) => row.current_price, sortable: true },
    { name: "Previous Close", selector: (row: any) => row.previous_close, sortable: true },
    { name: "Day High", selector: (row: any) => row.day_high, sortable: true },
    { name: "Day Low", selector: (row: any) => row.day_low, sortable: true },
    { name: "Volume", selector: (row: any) => row.volume, sortable: true },
    { name: "Change %", selector: (row: any) => row.change_percentage, sortable: true },
    {
      name: "Actions",
      cell: (row: any, reloadData: () => void) => (
        <div className="flex gap-2">
          <Link
            href={`/stocks/${row.id}`}
            className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/stocks/${row.id}/edit`}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            <Pencil size={16} />
          </Link>
          <DeleteConfirm id={row.id} url={`/stocks/${row.id}`} onSuccess={reloadData} />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }

  ];

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Company", key: "company_name" },
    { label: "Current Price", key: "current_price" },
    { label: "Previous Close", key: "previous_close" },
    { label: "Day High", key: "day_high" },
    { label: "Day Low", key: "day_low" },
    { label: "Volume", key: "volume" },
    { label: "Change %", key: "change_percentage" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Stock" />

      {flash?.success && (
        <div className="mb-3 rounded bg-green-100 px-4 py-2 text-green-800">
          {flash.success}
        </div>
      )}
      {flash?.error && (
        <div className="mb-3 rounded bg-red-100 px-4 py-2 text-red-800">
          {flash.error}
        </div>
      )}

      <DataTableWrapper
        fetchUrl="/stocks-data"
        columns={columns}
        csvHeaders={csvHeaders}
        createUrl="/stocks/create"
        createLabel="+ Create Stock"
      />
    </AppLayout>
  );
}
