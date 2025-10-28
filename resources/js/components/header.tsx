import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

export default function Header() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            {/* Logo Image */}
                            <img
                                src="/logo-main.png"
                                alt="African Alliance Logo"
                                className="w-50 h-100 rounded object-contain"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-brandblue border-b-2 border-brandblue pb-1">Home</Link>
                        <Link href="/about-us" className="text-gray-600 hover:text-gray-900">About</Link>
                        <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {/* <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                                    </svg>
                                </button> */}
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="bg-brandblue text-white px-4 py-2 rounded-lg font-medium hover:bg-brandblue transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={register()}
                                    className="bg-brandblue text-white px-4 py-2 rounded-lg font-medium hover:bg-brandblue transition-colors"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>

    );
}
