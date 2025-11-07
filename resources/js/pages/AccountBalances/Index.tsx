import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import DataTableWrapper from "@/components/DataTableWrapper";
import { type BreadcrumbItem } from "@/types";
import { Eye, Trash2 } from "lucide-react";
import DeleteConfirm from "@/components/DeleteConfirm";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Account Balances", href: "/account-balances" }
];

export default function AccountBalancesList() {
    const { flash }: any = usePage().props;

    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true, width: "70px" },
        { name: "User", selector: (row: any) => row.user?.name || "N/A", sortable: true },
        { name: "Cash Balance", selector: (row: any) => `RF ${Number(row.cash_balance).toFixed(2)}`, sortable: true },
        { name: "Invested Amount", selector: (row: any) => `RF ${Number(row.invested_amount).toFixed(2)}`, sortable: true },
        { name: "Portfolio Value", selector: (row: any) => `RF ${Number(row.total_portfolio_value).toFixed(2)}`, sortable: true },
        { name: "Total P&L", selector: (row: any) => `RF ${Number(row.total_pnl).toFixed(2)}`, sortable: true },


        {
            name: "Actions",
            cell: (row: any, reloadData: () => void) => (
                <div className="flex gap-2">
                    <Link
                        href={`/account-balances/${row.id}/edit`}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        <Eye size={16} />
                    </Link>
                    <DeleteConfirm id={row.id} url={`/account-balances/${row.id}`} onSuccess={reloadData} />
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
        { label: "User", key: "user.name" },
        { label: "Cash Balance", key: "cash_balance" },
        { label: "Invested Amount", key: "invested_amount" },
        { label: "Total Portfolio", key: "total_portfolio_value" },
        { label: "Total PnL", key: "total_pnl" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Balances" />

            {flash?.success && (
                <div className="mb-3 rounded bg-green-100 px-4 py-2 text-green-800">
                    {flash.success}
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">All Account Balances</h2>
                </div>

                <DataTableWrapper
                    fetchUrl="/account-balances-data"
                    columns={columns}
                    csvHeaders={csvHeaders}
                    createUrl="/account-balances/create"
                    createLabel="Add Balance"
                />
            </div>
        </AppLayout>
    );
}
