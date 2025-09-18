import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Create',
        href: 'stocks',
    },
];

export default function StockCreate() {
    const { companies } = usePage().props as any; // 👈 backend se companies bhejni hongi

    const [data, setData] = useState({
        company_id: '',
        current_price: '',
        previous_close: '',
        day_high: '',
        day_low: '',
        volume: '',
        change_amount: '',
        change_percentage: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/stocks', data, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Stock" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Create New Stock</h1>
                    <Link
                        href="/stocks"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back to stocks
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-4 bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
                    
                    {/* Company Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <select
                            name="company_id"
                            value={data.company_id}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        >
                            <option value="">-- Select Company --</option>
                            {companies?.map((company: any) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                        {errors.company_id && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.company_id}</p>
                        )}
                    </div>

                    {/* Current Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                        <input
                            type="number"
                            step="0.01"
                            name="current_price"
                            value={data.current_price}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        />
                        {errors.current_price && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.current_price}</p>
                        )}
                    </div>

                    {/* Previous Close */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Previous Close</label>
                        <input
                            type="number"
                            step="0.01"
                            name="previous_close"
                            value={data.previous_close}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        />
                        {errors.previous_close && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.previous_close}</p>
                        )}
                    </div>

                    {/* Day High */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Day High</label>
                        <input
                            type="number"
                            step="0.01"
                            name="day_high"
                            value={data.day_high}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        />
                        {errors.day_high && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.day_high}</p>
                        )}
                    </div>

                    {/* Day Low */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Day Low</label>
                        <input
                            type="number"
                            step="0.01"
                            name="day_low"
                            value={data.day_low}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        />
                        {errors.day_low && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.day_low}</p>
                        )}
                    </div>

                    {/* Volume */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                        <input
                            type="number"
                            name="volume"
                            value={data.volume}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        />
                        {errors.volume && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.volume}</p>
                        )}
                    </div>

                    {/* Change Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Change Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            name="change_amount"
                            value={data.change_amount}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        />
                        {errors.change_amount && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.change_amount}</p>
                        )}
                    </div>

                    {/* Change Percentage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Change %</label>
                        <input
                            type="number"
                            step="0.01"
                            name="change_percentage"
                            value={data.change_percentage}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3"
                        />
                        {errors.change_percentage && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.change_percentage}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Stock'}
                        </button>
                        <Link
                            href="/stocks"
                            className="inline-block font-bold text-sm text-blue-500 hover:text-blue-800"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
