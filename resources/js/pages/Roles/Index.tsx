// resources/js/Pages/Roles/Index.tsx
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pencil, Eye, Trash2 } from "lucide-react";
import DataTableWrapper from "@/components/DataTableWrapper";
import DeleteConfirm from "@/components/DeleteConfirm";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    users_count: number;
}

interface PageProps {
    userRole: string;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function RolesIndex() {
    const { props }: any = usePage();
    const { flash, userRole } = props;


    const isAdmin = userRole === "admin";

    const columns = [
        { name: "ID", selector: (row: Role) => row.id, sortable: true },
        {
            name: "Role Name",
            selector: (row: Role) => row.name,
            sortable: true,
            cell: (row: Role) => (
                <span className="capitalize font-medium text-gray-900 dark:text-white">
                    {row.name}
                </span>
            )
        },
        {
            name: "Users",
            selector: (row: Role) => row.users_count,
            sortable: true,
            cell: (row: Role) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {row.users_count} users
                </span>
            )
        },
        {
            name: "Permissions",
            selector: (row: Role) => row.permissions.map(p => p.name).join(', '),
            sortable: false,
            cell: (row: Role) => (
                <div className="flex flex-wrap gap-1 max-w-md">
                    {row.permissions.slice(0, 3).map((permission) => (
                        <span
                            key={permission.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                            {permission.name}
                        </span>
                    ))}
                    {row.permissions.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{row.permissions.length - 3} more
                        </span>
                    )}
                </div>
            )
        },
        {
            name: "Actions",
            cell: (row: Role, reloadData: () => void) => (
                <div className="flex gap-2">
                    <Link
                        href={`/roles/${row.id}/edit`}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        <Pencil size={16} />
                    </Link>
                    {row.users_count === 0 && (
                        <DeleteConfirm
                            id={row.id}
                            url={`/roles/${row.id}`}
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
        { title: "Roles Management", href: "/roles" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Management" />

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
                fetchUrl="/roles-data"
                columns={columns}
                csvHeaders={[
                    { label: "ID", key: "id" },
                    { label: "Role Name", key: "name" },
                    { label: "Users Count", key: "users_count" },
                    { label: "Permissions", key: "permissions_list" },
                ]}
                createUrl={isAdmin ? "/roles/create" : undefined}
                createLabel={isAdmin ? "+ Create Role" : ""}
            />
        </AppLayout>
    );
}