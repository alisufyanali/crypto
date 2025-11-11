import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import DataTableWrapper from "@/components/DataTableWrapper";
import { type BreadcrumbItem } from "@/types";
import { Eye, Trash2, Wallet, TrendingUp, DollarSign } from "lucide-react";
import DeleteConfirm from "@/components/DeleteConfirm";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Account Balances", href: "/account-balances" }
];

export default function AccountBalancesList() {
    const { flash }: any = usePage().props;

    const columns = [
        { 
            name: "ID", 
            selector: (row: any) => row.id, 
            sortable: true, 
            width: "70px" 
        },
        { 
            name: "User", 
            selector: (row: any) => row.user?.name || "N/A", 
            sortable: true 
        },
        { 
            name: "Cash Balance", 
            selector: (row: any) => `RF ${Number(row.cash_balance).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            sortable: true 
        },
        { 
            name: "Invested Amount", 
            selector: (row: any) => `RF ${Number(row.invested_amount).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            sortable: true 
        },
        { 
            name: "Portfolio Value", 
            selector: (row: any) => `RF ${Number(row.total_portfolio_value).toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            sortable: true 
        },
        { 
            name: "Total P&L", 
            selector: (row: any) => {
                const pnl = Number(row.total_pnl);
                const colorClass = pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
                return <span className={`font-medium ${colorClass}`}>RF {pnl.toLocaleString('en-RW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
            }, 
            sortable: true 
        },
        {
            name: "Actions",
            cell: (row: any, reloadData: () => void) => (
                <div className="flex gap-2">
                    <Link
                        href={`/account-balances/${row.id}/edit`}
                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-sm"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </Link>
                    <DeleteConfirm 
                        id={row.id} 
                        url={`/account-balances/${row.id}`} 
                        onSuccess={reloadData} 
                    />
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

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-6 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-4 py-3 text-green-800 dark:text-green-300">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {flash.success}
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-300">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {flash.error}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 mb-4 sm:mb-0">
                            <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                                <Wallet className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Account Balances
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage and monitor all user account balances
                                </p>
                            </div>
                        </div>
                        
                        {/* Stats Summary */}
                        <div className="flex gap-4 text-center">
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 min-w-20">
                                <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                <div className="text-lg font-bold text-gray-900 dark:text-white">Cash</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Balance</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 min-w-20">
                                <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <div className="text-lg font-bold text-gray-900 dark:text-white">Invested</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Amount</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DataTable */}
                <DataTableWrapper
                    fetchUrl="/account-balances-data"
                    columns={columns}
                    csvHeaders={csvHeaders}
                    createUrl="/account-balances/create"
                    createLabel="Add New Balance"
                    additionalFilters={[
                        {
                            name: "user_id",
                            label: "Filter by User",
                            type: "select",
                            options: [
                                { value: "", label: "All Users" },
                                // You can dynamically populate this from props if needed
                            ]
                        }
                    ]}
                />
            </div>

            {/* Help Text */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                        <Wallet className="text-blue-600 dark:text-blue-300" size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Account Balances Management
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Monitor cash balances and investment portfolios
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Track profit and loss for each user account
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Export data for reporting and analysis
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Update balances as needed for accurate tracking
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}