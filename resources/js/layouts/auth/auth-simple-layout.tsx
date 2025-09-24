import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-hero">
         
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">

                    {/* Header */}
                    <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                        <div className="mb-1 flex h-9 w-20 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                        </div>
                    </Link>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
                        <p className="text-gray-600">Sign in an account and get things done today!</p>
                    </div>

                    {status && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}


                    {children}
                </div>
            </div>
        </div>
    );
}
