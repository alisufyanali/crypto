import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

// shadcn/ui imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface Company {
  id: number;
  name: string;
  symbol: string;
  description: string | null;
  sector: string | null;
  market_cap: string | null;
  shares_outstanding: string | null;
  logo_path: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Companies", href: "/companies" },
  { title: "Edit", href: "#" },
];

export default function CompanyEdit() {
  const { props }: any = usePage();
  const company: Company = props.company;

  const [data, setData] = useState({
    name: company.name || "",
    symbol: company.symbol || "",
    description: company.description || "",
    sector: company.sector || "",
    market_cap: company.market_cap || "",
    shares_outstanding: company.shares_outstanding || "",
    logo: null as File | null,
  });

  const [errors, setErrors] = useState<any>(props.errors || {});
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

    router.post(`/companies/${company.id}`, {
      ...data,
      _method: "PUT", // Laravel ke update ke liye
    }, {
      forceFormData: true,
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
      <Head title="Edit Company" />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">✏️ Edit Company</h1>
          <Link
            href="/companies"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Companies
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Update Company Information</CardTitle>
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
                  />
                  {errors.shares_outstanding && (
                    <p className="text-red-500 text-xs">
                      {errors.shares_outstanding}
                    </p>
                  )}
                </div>
              </div>

              {/* Logo */}
              <div className="grid gap-2">
                <Label>Logo</Label>
                <Input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                />
                {company.logo_path && (
                  <img
                    src={`/storage/${company.logo_path}`}
                    alt="Company Logo"
                    className="h-12 mt-2"
                  />
                )}
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
                  {processing ? "Updating..." : "Update Company"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
