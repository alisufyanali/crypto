import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
interface Props {
  stock: any;
  companies: { id: number; name: string }[];
}

export default function Edit({ stock, companies }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock List', href: '/stocks' },
    { title: `Edit ${stock.id}`, href: `/stocks/${stock.id}/edit` },
  ];
  
  type StockFormData = {
    company_id: string | number;
    current_price: string;
    previous_close: string;
    day_high: string;
    day_low: string;
    volume: string;
    change_amount: string;
    change_percentage: string;
  };

  const { data, setData, put, processing, errors } = useForm<StockFormData>({
    company_id: stock.company_id?.toString() || '',
    current_price: stock.current_price?.toString() || '',
    previous_close: stock.previous_close?.toString() || '',
    day_high: stock.day_high?.toString() || '',
    day_low: stock.day_low?.toString() || '',
    volume: stock.volume?.toString() || '',
    change_amount: stock.change_amount?.toString() || '',
    change_percentage: stock.change_percentage?.toString() || '',
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/stocks/${stock.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Stock" />
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📈 Edit Stock</h1>
          <Link
            href="/stocks"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Stocks
          </Link>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 p-6 m-2 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">Stock Information</h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Company */}
            <div className="grid gap-2">
              <Label htmlFor="company_id">Company</Label>
              <select
                id="company_id"
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
              <InputError message={errors.company_id} />
            </div>

            {/* Current Price */}
            <div className="grid gap-2">
              <Label htmlFor="current_price">Current Price</Label>
              <Input
                id="current_price"
                type="number"
                value={data.current_price}
                onChange={(e) => setData('current_price', e.target.value)}
                placeholder="Enter current price"
              />
              <InputError message={errors.current_price} />
            </div>

            {/* Previous Close */}
            <div className="grid gap-2">
              <Label htmlFor="previous_close">Previous Close</Label>
              <Input
                id="previous_close"
                type="number"
                value={data.previous_close}
                onChange={(e) => setData('previous_close', e.target.value)}
                placeholder="Enter previous close"
              />
              <InputError message={errors.previous_close} />
            </div>

            {/* Day High & Low */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="day_high">Day High</Label>
                <Input
                  id="day_high"
                  type="number"
                  value={data.day_high}
                  onChange={(e) => setData('day_high', e.target.value)}
                  placeholder="Day high"
                />
                <InputError message={errors.day_high} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="day_low">Day Low</Label>
                <Input
                  id="day_low"
                  type="number"
                  value={data.day_low}
                  onChange={(e) => setData('day_low', e.target.value)}
                  placeholder="Day low"
                />
                <InputError message={errors.day_low} />
              </div>
            </div>

            {/* Volume */}
            <div className="grid gap-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                type="number"
                value={data.volume}
                onChange={(e) => setData('volume', e.target.value)}
                placeholder="Enter volume"
              />
              <InputError message={errors.volume} />
            </div>

            {/* Change Amount & Percentage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="change_amount">Change Amount</Label>
                <Input
                  id="change_amount"
                  type="number"
                  value={data.change_amount}
                  onChange={(e) => setData('change_amount', e.target.value)}
                  placeholder="Change amount"
                />
                <InputError message={errors.change_amount} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="change_percentage">Change %</Label>
                <Input
                  id="change_percentage"
                  type="number"
                  value={data.change_percentage}
                  onChange={(e) => setData('change_percentage', e.target.value)}
                  placeholder="Change percentage"
                />
                <InputError message={errors.change_percentage} />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Link href="/stocks">
                <Button variant="outline" type="button" className="cursor-pointer">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing} className="cursor-pointer">
                {processing ? 'Updating...' : 'Update Stock'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
