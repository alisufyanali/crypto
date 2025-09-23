import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ClientEdit() {
  const { client, errors }: any = usePage().props;

  const [data, setData] = useState({
    name: client.name || "",
    email: client.email || "",
    password: "",
    password_confirmation: "",
  });

  const [processing, setProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    router.put(`/clients/${client.id}`, data, {
      onError: () => setProcessing(false),
      onSuccess: () => setProcessing(false),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Clients", href: "/clients" },
    { title: "Edit", href: `/clients/${client.id}/edit` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Client" />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">✏️ Edit Client</h1>
          <Link
            href="/clients"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Clients
          </Link>
        </div>

        <Card className="max-w-xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                />
                {errors?.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                />
                {errors?.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label>New Password (optional)</Label>
                <Input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                />
                {errors?.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={handleChange}
                />
                {errors?.password_confirmation && (
                  <p className="text-red-500 text-xs">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3">
                <Link href="/clients">
                  <Button variant="outline" type="button" className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={processing} className="cursor-pointer">
                  {processing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {processing ? "Updating..." : "Update Client"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
