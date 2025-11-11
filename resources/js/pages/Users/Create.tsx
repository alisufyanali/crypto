import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

// shadcn/ui imports
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
  UserPlus, 
  Shield,
  Info,
  CheckCircle2
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Users", href: "/users" },
  { title: "Create User", href: "/users/create" },
];

export default function UserCreate() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }

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

    router.post("/users", data, {
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
      <Head title="Create New User" />

      <div className="space-y-6 p-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <UserPlus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New user
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Add a new user to your trading platform
              </p>
            </div>
          </div>
          <Button variant="outline" asChild className="flex items-center gap-2 border-2">
            <Link href="/users">
              <ArrowLeft size={16} />
              Back to users
            </Link>
          </Button>
        </div>

        {/* Create user Card */}
        <Card className="shadow-xl border-0 dark:border dark:border-gray-700 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-900/50">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border-b border-blue-100 dark:border-gray-700">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                <User className="text-white" size={20} />
              </div>
              <span className="text-gray-900 dark:text-white">
                user Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <User size={16} className="text-blue-500" />
                  Full Name
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter user's full name"
                  className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <Info size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="text-blue-500" />
                  Email Address
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <Info size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Lock size={16} className="text-blue-500" />
                  Password
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
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
                
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <Info size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password_confirmation" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Shield size={16} className="text-blue-500" />
                  Confirm Password
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={handleChange}
                  placeholder="Re-enter the password"
                  className={`h-12 text-lg px-4 border-2 transition-all duration-200 ${
                    errors.password_confirmation 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {data.password_confirmation && data.password === data.password_confirmation && (
                  <p className="text-green-500 text-sm flex items-center gap-1 mt-2">
                    <CheckCircle2 size={14} />
                    Passwords match
                  </p>
                )}
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <Info size={14} />
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="submit" 
                  disabled={processing} 
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Creating user...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-3 h-5 w-5" />
                      Create user Account
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  asChild
                  className="h-12 text-lg font-semibold border-2"
                >
                  <Link href="/users">
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg shadow-md">
                <Info className="text-blue-600 dark:text-blue-300" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  user Creation Guide
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    user will receive login credentials via email
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    KYC verification is required before trading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    You can manage user status from the dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Ensure password meets security requirements
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