import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Props {
  stock: any;
  companies: { id: number; name: string }[];
}

export default function Edit({ stock, companies }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock List', href: '/stocks' },
    { title: `Edit ${stock.id}`, href: `/stocks/${stock.id}/edit` },
  ];

  const { data, setData, put, processing, errors } = useForm({
    current_price: stock.current_price || '',
    previous_close: stock.previous_close || '',
    day_high: stock.day_high || '',
    day_low: stock.day_low || '',
    volume: stock.volume || '',
    change_amount: stock.change_amount || '',
    change_percentage: stock.change_percentage || '',
    company_id: stock.company_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/stocks/${stock.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Stock" />

      <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 p-6 m-2 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Edit Stock</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Company */}
          <div>
            <label className="block text-sm font-medium">Company</label>
            <select
              value={data.company_id}
              onChange={(e) => setData('company_id', e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id}</p>}
          </div>

          {/* Current Price */}
          <div>
            <label className="block text-sm font-medium">Current Price</label>
            <input
              type="number"
              value={data.current_price}
              onChange={(e) => setData('current_price', e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
            {errors.current_price && <p className="text-red-500 text-sm">{errors.current_price}</p>}
          </div>

          {/* Previous Close */}
          <div>
            <label className="block text-sm font-medium">Previous Close</label>
            <input
              type="number"
              value={data.previous_close}
              onChange={(e) => setData('previous_close', e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Day High & Low */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Day High</label>
              <input
                type="number"
                value={data.day_high}
                onChange={(e) => setData('day_high', e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Day Low</label>
              <input
                type="number"
                value={data.day_low}
                onChange={(e) => setData("day_low", Number(e.target.value))}
                className="w-full rounded border px-3 py-2"
                />

            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-medium">Volume</label>
            <input
              type="number"
              value={data.volume}
              onChange={(e) => setData('volume', e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Change Amount & Percentage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Change Amount</label>
              <input
                type="number"
                value={data.change_amount}
                onChange={(e) => setData('change_amount', e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Change Percentage</label>
              <input
                type="number"
                value={data.change_percentage}
                onChange={(e) => setData('change_percentage', e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
            >
              {processing ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
