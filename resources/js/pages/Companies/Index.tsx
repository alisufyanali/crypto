import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil, Eye } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";

export default function CompanyList() {
  const { flash, userRole }: any = usePage().props;

  const isAdminOrBroker = userRole === "admin" || userRole === "broker";

  const columns = [
    { name: "ID", selector: (row: any) => row.id, sortable: true },
    { name: "Name", selector: (row: any) => row.name, sortable: true },
    { name: "Symbol", selector: (row: any) => row.symbol, sortable: true },
    { name: "Sector", selector: (row: any) => row.sector || "N/A", sortable: true },
    { name: "Market Cap", selector: (row: any) => row.market_cap, sortable: true },
    { name: "Shares", selector: (row: any) => row.shares_outstanding, sortable: true },
    {
      name: "Actions",
      cell: (row: any, reloadData: () => void) =>
        isAdminOrBroker ? (
          <div className="flex gap-2">
            <Link
              href={`/companies/${row.id}`}
              className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
            >
              <Eye size={16} />
            </Link>
            <Link
              href={`/companies/${row.id}/edit`}
              className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              <Pencil size={16} />
            </Link>
            <DeleteConfirm id={row.id} url={`/companies/${row.id}`} onSuccess={reloadData} />
          </div>
        ) : (
          <Link
            href={`/companies/${row.id}`}
            className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            <Eye size={16} />
          </Link>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ title: "Company List", href: "/companies" }]}>
      <Head title="Companies" />

      {flash?.success && (
        <div className="mb-3 rounded bg-green-100 px-4 py-2 text-green-800">
          {flash.success}
        </div>
      )}

      <DataTableWrapper
        fetchUrl="/companies-data"
        columns={columns}
        csvHeaders={[
          { label: "ID", key: "id" },
          { label: "Name", key: "name" },
          { label: "Symbol", key: "symbol" },
          { label: "Sector", key: "sector" },
          { label: "Market Cap", key: "market_cap" },
          { label: "Shares Outstanding", key: "shares_outstanding" },
        ]}
        // ✅ Hide Create button for clients
        createUrl={isAdminOrBroker ? "/companies/create" : undefined}
        createLabel={isAdminOrBroker ? "+ Create Company" : ""}
      />
    </AppLayout>
  );
}
