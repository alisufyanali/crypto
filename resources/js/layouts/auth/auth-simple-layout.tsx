import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    status?: string;
}

export default function AuthSimpleLayout({
    children,
    title = 'Sign in',
    description = 'Sign in to your account and get started!',
    status,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Left Side - Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                {/* Background Image */}
                <img
                    src="/home.png"
                    alt="Flight Illustration"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/70 via-teal-50/70 to-blue-50/70 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-black/90"></div>

                {/* Optional Text or Branding */}
                <div className="relative z-10 max-w-lg text-center p-10">
                    {/* Add content if needed */}
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-950 transition-colors duration-300">
                <div className="w-full max-w-md space-y-6">
                    {/* Header */}
                    <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                        <div className="mb-1 flex h-9 w-20 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-9 fill-current text-emerald-600 dark:text-white" />
                        </div>
                    </Link>

                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{description}</p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="bg-green-50 dark:bg-emerald-950/40 border border-green-200 dark:border-emerald-800 rounded-lg p-3 text-center text-sm font-medium text-green-700 dark:text-emerald-400">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    {children}
                </div>
            </div>
        </div>
    );
}
