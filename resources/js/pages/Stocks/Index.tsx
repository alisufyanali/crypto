import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock List',
        href: 'stocks',
    },
];

export default function StockList() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/stocks-data')
            .then((res) => res.json())
            .then((result) => {
                setStocks(result.data || []);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this stock?')) return;
        router.delete(`/stocks/${id}`, {
            onSuccess: () => {
                setStocks((prev) => prev.filter((s) => s.id !== id));
            },
        });
    };

    const columns = [
        { name: 'ID', selector: (row: any) => row.id, sortable: true, width: '70px' },
        { name: 'Company', selector: (row: any) => row.company_name, sortable: true },
        { name: 'Current Price', selector: (row: any) => row.current_price, sortable: true },
        { name: 'Previous Close', selector: (row: any) => row.previous_close, sortable: true },
        { name: 'Day High', selector: (row: any) => row.day_high, sortable: true },
        { name: 'Day Low', selector: (row: any) => row.day_low, sortable: true },
        { name: 'Volume', selector: (row: any) => row.volume, sortable: true },
        { name: 'Change %', selector: (row: any) => row.change_percentage, sortable: true },
        {
            name: 'Actions',
            cell: (row: any) => (
                <div className="flex gap-2">
                    <Link
                        href={`/stocks/${row.id}/edit`}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        <Pencil size={16} />
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const { flash }: any = usePage().props;

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

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* 🔘 Create Stock Button */}
                <div className="flex justify-end mb-3">
                    <Link
                        href="/stocks/create"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                    >
                        + Create Stock
                    </Link>
                </div>

                {/* 📊 DataTable */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:bg-neutral-900 shadow-md">
                    <DataTable
                        columns={columns}
                        data={stocks}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </div>
            </div>
        </AppLayout>
    );
}
