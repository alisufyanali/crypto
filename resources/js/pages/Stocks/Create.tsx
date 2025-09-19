import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";

// shadcn/ui imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Stock Create", href: "stocks" },
];

export default function StockCreate() {
  const { companies } = usePage().props as any;

  const [data, setData] = useState({
    company_id: "",
    current_price: "",
    previous_close: "",
    day_high: "",
    day_low: "",
    volume: "",
    change_amount: "",
    change_percentage: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    router.post("/stocks", data, {
      onError: (errors) => {
        setErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => {
        setProcessing(false);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Stock" />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📈 Create New Stock</h1>
          <Link
            href="/stocks"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Stocks
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Stock Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company Select */}
              <div className="grid gap-2">
                <Label>Company</Label>
                <Select
                  value={data.company_id}
                  onValueChange={(value) =>
                    setData({ ...data, company_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Company --" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company: any) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.company_id && (
                  <p className="text-red-500 text-xs">{errors.company_id}</p>
                )}
              </div>

              {/* Current Price */}
              <div className="grid gap-2">
                <Label>Current Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="current_price"
                  value={data.current_price}
                  onChange={handleChange}
                  placeholder="Enter current price"
                />
                {errors.current_price && (
                  <p className="text-red-500 text-xs">{errors.current_price}</p>
                )}
              </div>

              {/* Previous Close */}
              <div className="grid gap-2">
                <Label>Previous Close</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="previous_close"
                  value={data.previous_close}
                  onChange={handleChange}
                  placeholder="Enter previous close"
                />
                {errors.previous_close && (
                  <p className="text-red-500 text-xs">{errors.previous_close}</p>
                )}
              </div>

              {/* Day High / Day Low (grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Day High</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="day_high"
                    value={data.day_high}
                    onChange={handleChange}
                    placeholder="Day high"
                  />
                  {errors.day_high && (
                    <p className="text-red-500 text-xs">{errors.day_high}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Day Low</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="day_low"
                    value={data.day_low}
                    onChange={handleChange}
                    placeholder="Day low"
                  />
                  {errors.day_low && (
                    <p className="text-red-500 text-xs">{errors.day_low}</p>
                  )}
                </div>
              </div>

              {/* Volume */}
              <div className="grid gap-2">
                <Label>Volume</Label>
                <Input
                  type="number"
                  name="volume"
                  value={data.volume}
                  onChange={handleChange}
                  placeholder="Enter volume"
                />
                {errors.volume && (
                  <p className="text-red-500 text-xs">{errors.volume}</p>
                )}
              </div>

              {/* Change Amount + Percentage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Change Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="change_amount"
                    value={data.change_amount}
                    onChange={handleChange}
                    placeholder="Change amount"
                  />
                  {errors.change_amount && (
                    <p className="text-red-500 text-xs">
                      {errors.change_amount}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Change %</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="change_percentage"
                    value={data.change_percentage}
                    onChange={handleChange}
                    placeholder="Change percentage"
                  />
                  {errors.change_percentage && (
                    <p className="text-red-500 text-xs">
                      {errors.change_percentage}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Link href="/stocks">
                  <Button variant="outline" type="button"  className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}  className="cursor-pointer">
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {processing ? "Creating..." : "Create Stock"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
