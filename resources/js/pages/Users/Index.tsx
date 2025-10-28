import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil, Eye, Trash, CheckCircle, XCircle } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Users List", href: "/users" }];

export default function UsersList() {
  const { flash }: any = usePage().props;

  const columns = [
    { name: "ID", selector: (row: any) => row.id, sortable: true , width: "10%" },
    { name: "Name", selector: (row: any) => row.name, sortable: true , width: "25%"},
    { name: "Email", selector: (row: any) => row.email, sortable: true , width: "25%"},
    { name: " Status", selector: (row: any) => row.kyc_status , sortable: true , width: "10%"},
    { name: "Active Status", selector: (row: any) => row.is_active , sortable: true , width: "10%"},
    {
      name: "Actions",
      cell: (row: any, reloadData: () => void) => (
        <div className="flex gap-2">
          {/* View */}
          <Link
            href={`/users/${row.id}`}
            className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            <Eye size={16} />
          </Link>

          {/* Edit */}
          <Link
            href={`/users/${row.id}/edit`}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            <Pencil size={16} />
          </Link>

          {/* Delete */}
          <DeleteConfirm id={row.id} url={`/users/${row.id}`} onSuccess={reloadData} />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
       width: "20%"
    },
  ];

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "KYC Status", key: "status" },
    { label: "Active Status", key: "is_active" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="users" />

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
        fetchUrl="/users/data"
        columns={columns}
        csvHeaders={csvHeaders}
        createUrl="/users/create"
        createLabel="+ Create Users"
      />
    </AppLayout>
  );
}
