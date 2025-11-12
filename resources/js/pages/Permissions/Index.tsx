import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";

interface Permission {
    id: number;
    name: string;
    description?: string;
    category: string;
    roles_count: number;
}

interface PageProps {
    userRole: string;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function PermissionsIndex() {
    const { props }: any = usePage();
    const { flash, userRole } = props;

    const isAdmin = userRole === "admin";

    const columns = [
        { 
            name: "ID", 
            selector: (row: Permission) => row.id, 
            sortable: true,
            width: "80px"
        },
        { 
            name: "Permission Name", 
            selector: (row: Permission) => row.name, 
            sortable: true,
            cell: (row: Permission) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {row.name}
                    </div>
                    {row.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {row.description}
                        </div>
                    )}
                </div>
            )
        },
        { 
            name: "Category", 
            selector: (row: Permission) => row.category, 
            sortable: true,
            cell: (row: Permission) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize">
                    {row.category}
                </span>
            )
        },
        { 
            name: "Roles", 
            selector: (row: Permission) => row.roles_count, 
            sortable: true,
            cell: (row: Permission) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {row.roles_count} roles
                </span>
            )
        },
        {
            name: "Actions",
            cell: (row: Permission, reloadData: () => void) => (
                <div className="flex gap-2">
                    <Link
                        href={`/permissions/${row.id}/edit`}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        <Pencil size={16} />
                    </Link>
                    {row.roles_count === 0 && (
                        <DeleteConfirm 
                            id={row.id} 
                            url={`/permissions/${row.id}`} 
                            onSuccess={reloadData}
                        />
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const breadcrumbs = [
        { title: "Permissions Management", href: "/permissions" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions Management" />

            {flash?.success && (
                <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flash.error}
                    </div>
                </div>
            )}

            <DataTableWrapper
                fetchUrl="/permissions-data"
                columns={columns}
                csvHeaders={[
                    { label: "ID", key: "id" },
                    { label: "Permission Name", key: "name" },
                    { label: "Category", key: "category" },
                    { label: "Description", key: "description" },
                    { label: "Roles Count", key: "roles_count" },
                ]}
                createUrl={isAdmin ? "/permissions/create" : undefined}
                createLabel={isAdmin ? "+ Create Permission" : ""}
            />
        </AppLayout>
    );
}