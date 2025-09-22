import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil, Eye, Trash, CheckCircle, XCircle } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";

const breadcrumbs: BreadcrumbItem[] = [{ title: "User List", href: "/users" }];

export default function UserList() {
  const { flash }: any = usePage().props;

  const columns = [
    { name: "ID", selector: (row: any) => row.id, sortable: true, width: "70px" },
    { name: "Name", selector: (row: any) => row.name, sortable: true },
    { name: "Email", selector: (row: any) => row.email, sortable: true },
    { name: "Role", selector: (row: any) => row.role || "N/A", sortable: true },
    { name: "Status", selector: (row: any) => row.status, sortable: true },
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

          {/* Status Toggle */}
          <button
            onClick={async () => {
              const res = await fetch(`/users/${row.id}/toggle-status`, {
                method: "POST",
                headers: {
                  "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as any).content,
                },
              });
              if (res.ok) reloadData();
            }}
            className={`p-2 rounded ${
              row.status === "Active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {row.status === "Active" ? <XCircle size={16} /> : <CheckCircle size={16} />}
          </button>

          {/* Delete */}
          <DeleteConfirm id={row.id} url={`/users/${row.id}`} onSuccess={reloadData} />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Status", key: "status" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

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
        fetchUrl="/users-data"
        columns={columns}
        csvHeaders={csvHeaders}
        createUrl="/users/create"
        createLabel="+ Create User"
      />
    </AppLayout>
  );
}
