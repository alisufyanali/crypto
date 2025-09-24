import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import  Header  from '@/components/header';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [email, setEmail] = useState('');

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 bg-hero">
                {/* Header */}
                 <Header>
                 </Header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">

                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                        {/* Left Side - Phone Mockups */}
                        <div className="relative mb-12 lg:mb-0">
                            <div className="flex items-center justify-center">
                                {/* Left Image - slightly lower */}
                                <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10 mt-8">
                                    <img
                                        src="home/left.png"
                                        alt="Left Phone Mockup"
                                        className="w-64 h-[520px] object-cover rounded-[2.5rem] shadow-2xl"
                                    />
                                </div>

                                {/* Right Image - slightly higher and overlapping */}
                                <div className="relative transform rotate-6 hover:rotate-0 transition-transform duration-500 z-20 -ml-12 -mt-8">
                                    <img
                                        src="home/right.png"
                                        alt="Right Phone Mockup"
                                        className="w-64 h-[520px] object-cover rounded-[2.5rem] shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-5xl lg:text-6xl font-bold text-brandblue leading-tight">
                                    Introducing First Global Cryptofunding  Platform
                                </h1>
                            </div>

                            {/* Service Tags */}
                            <div className="flex flex-wrap gap-4">
                                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">Stockbrokerage</span>
                                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">Advisory</span>
                                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">Research</span>
                            </div>

                            {/* Email Signup */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Africanalliance@gmail.com"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        <button className="bg-brandblue text-white px-8 py-3 rounded-lg font-medium hover:bg-brandblue transition-colors whitespace-nowrap">
                                            Sign up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}