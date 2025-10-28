import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";

export default function UserEdit() {
  const { user, errors }: any = usePage().props;

  const [data, setData] = useState({
    name: user.name || "",
    email: user.email || "",
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

    router.put(`/users/${user.id}`, data, {
      onError: () => setProcessing(false),
      onSuccess: () => setProcessing(false),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Users", href: "/users" },
    { title: "Edit User", href: `/users/${user.id}/edit` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit User" />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="text-2xl">✏️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
              <p className="text-sm text-gray-600 mt-1">
                Update user information and permissions
              </p>
            </div>
          </div>
          
          <Link
            href="/users"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-300 bg-white hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter full name"
                  />
                  {errors?.name && (
                    <p className="text-red-500 text-xs font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter email address"
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-xs font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter new password"
                  />
                  {errors?.password && (
                    <p className="text-red-500 text-xs font-medium">{errors.password}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Leave blank to keep current password
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Confirm new password"
                  />
                  {errors?.password_confirmation && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                <Link href="/users" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full sm:w-auto cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {processing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {processing ? "Updating..." : "Update User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}