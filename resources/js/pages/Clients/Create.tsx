import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

// shadcn/ui imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, ArrowLeft, Mail, Lock, UserPlus } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Clients", href: "/clients" },
  { title: "Create Client", href: "/clients/create" },
];

export default function ClientCreate() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    router.post("/clients", data, {
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
      <Head title="Create New Client" />

      <div className="space-y-6 p-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Client</h1>
              <p className="text-gray-600">Add a new client to your system</p>
            </div>
          </div>
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href="/clients">
              <ArrowLeft size={16} />
              Back to Clients
            </Link>
          </Button>
        </div>

        {/* Create Client Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="text-blue-600" size={20} />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User size={16} className="text-gray-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter client's full name"
                  className={`h-11 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail size={16} className="text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock size={16} className="text-gray-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  className={`h-11 ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password_confirmation" className="flex items-center gap-2 text-sm font-medium">
                  <Lock size={16} className="text-gray-500" />
                  Confirm Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={handleChange}
                  placeholder="Re-enter the password"
                  className={`h-11 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  type="submit" 
                  disabled={processing} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-11"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Client...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Client
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  asChild
                  className="h-11"
                >
                  <Link href="/clients">
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-100 rounded">
              <User className="text-blue-600" size={16} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Client Creation Tips</h4>
              <p className="text-sm text-blue-700">
                After creating the client, they will be able to log in and complete their KYC verification process. 
                You can manage their status and documents from the client details page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}