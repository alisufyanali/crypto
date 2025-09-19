import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

// shadcn/ui imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Companies", href: "/companies" },
  { title: "Create", href: "/companies/create" },
];

export default function CompanyCreate() {
  const [data, setData] = useState({
    name: "",
    symbol: "",
    description: "",
    sector: "",
    market_cap: "",
    shares_outstanding: "",
    current_price: "",
    logo: null as File | null,
  });

  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (files) {
      setData({ ...data, [name]: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    router.post("/companies", data, {
      forceFormData: true, // file upload ke liye
      onError: (errors) => {
        setErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => {
        setProcessing(false);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Company" />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏢 Create New Company</h1>
          <Link
            href="/companies"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Companies
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="grid gap-2">
                <Label>Company Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              {/* Symbol */}
              <div className="grid gap-2">
                <Label>Symbol</Label>
                <Input
                  type="text"
                  name="symbol"
                  value={data.symbol}
                  onChange={handleChange}
                  placeholder="e.g. BK"
                />
                {errors.symbol && (
                  <p className="text-red-500 text-xs">{errors.symbol}</p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  placeholder="Short company description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description}</p>
                )}
              </div>

              {/* Sector */}
              <div className="grid gap-2">
                <Label>Sector</Label>
                <Input
                  type="text"
                  name="sector"
                  value={data.sector}
                  onChange={handleChange}
                  placeholder="e.g. Banking, Technology"
                />
                {errors.sector && (
                  <p className="text-red-500 text-xs">{errors.sector}</p>
                )}
              </div>

              {/* Market Cap + Shares Outstanding */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Market Cap</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="market_cap"
                    value={data.market_cap}
                    onChange={handleChange}
                    placeholder="e.g. 1000000000"
                  />
                  {errors.market_cap && (
                    <p className="text-red-500 text-xs">{errors.market_cap}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Shares Outstanding</Label>
                  <Input
                    type="number"
                    name="shares_outstanding"
                    value={data.shares_outstanding}
                    onChange={handleChange}
                    placeholder="e.g. 1000000"
                  />
                  {errors.shares_outstanding && (
                    <p className="text-red-500 text-xs">
                      {errors.shares_outstanding}
                    </p>
                  )}
                </div>
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
                  placeholder="Enter current stock price"
                />
                {errors.current_price && (
                  <p className="text-red-500 text-xs">
                    {errors.current_price}
                  </p>
                )}
              </div>

              {/* Logo Upload */}
              <div className="grid gap-2">
                <Label>Logo</Label>
                <Input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                />
                {errors.logo && (
                  <p className="text-red-500 text-xs">{errors.logo}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3">
                <Link href="/companies">
                  <Button variant="outline" type="button" className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={processing} className="cursor-pointer">
                  {processing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {processing ? "Creating..." : "Create Company"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
