import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  User, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Shield,
  Info,
  CheckCircle2,
  UserCog,
  AlertCircle
} from "lucide-react";

export default function ClientEdit() {
  const { client, errors }: any = usePage().props;

  const [data, setData] = useState({
    name: client.name || "",
    email: client.email || "",
    password: "",
    password_confirmation: "",
  });

  const [processing, setProcessing] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
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
    { title: client.name || "Client", href: `/clients/${client.id}` },
    { title: "Edit", href: `/clients/${client.id}/edit` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${client.name}`} />

      <div className="space-y-6 p-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <UserCog className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Edit Client
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update {client.name}'s information
              </p>
            </div>
          </div>
          <Button variant="outline" asChild className="flex items-center gap-2 border-2">
            <Link href={`/clients/${client.id}`}>
              <ArrowLeft size={16} />
              Back to Profile
            </Link>
          </Button>
        </div>

        {/* Edit Client Card */}
        <Card className="shadow-xl border-0 dark:border dark:border-gray-700 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-900/10">
          <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border-b border-amber-100 dark:border-gray-700">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-amber-500 rounded-lg shadow-md">
                <User className="text-white" size={20} />
              </div>
              <span className="text-gray-900 dark:text-white">
                Update Client Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <User size={16} className="text-amber-500" />
                  Full Name
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter client's full name"
                  className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                    errors?.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors?.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="text-amber-500" />
                  Email Address
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                    errors?.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors?.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Section */}
              <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Info size={18} />
                  <span className="text-sm font-medium">Leave passwords blank to keep current password</span>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Lock size={16} className="text-amber-500" />
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Enter new password (optional)"
                    className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                      errors?.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  />
                  
                  {/* Password Strength Meter */}
                  {data.password && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                        <span className={`font-medium ${
                          passwordStrength <= 2 ? 'text-red-500' : 
                          passwordStrength <= 3 ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {errors?.password && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                      <AlertCircle size={14} />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password_confirmation" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Shield size={16} className="text-amber-500" />
                    Confirm New Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                      errors?.password_confirmation 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  />
                  {data.password_confirmation && data.password === data.password_confirmation && data.password && (
                    <p className="text-green-500 text-sm flex items-center gap-1 mt-2">
                      <CheckCircle2 size={14} />
                      Passwords match
                    </p>
                  )}
                  {errors?.password_confirmation && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                      <AlertCircle size={14} />
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="submit" 
                  disabled={processing} 
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Updating Client...
                    </>
                  ) : (
                    <>
                      <UserCog className="mr-3 h-5 w-5" />
                      Update Client
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  asChild
                  className="h-12 text-lg font-semibold border-2"
                >
                  <Link href={`/clients/${client.id}`}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg shadow-md">
                <Info className="text-amber-600 dark:text-amber-300" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Update Guidelines
                </h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Email changes will require verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Password changes take effect immediately
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Client will be notified of significant changes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    KYC status remains unchanged
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}