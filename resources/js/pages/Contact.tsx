import { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { LoaderCircle } from 'lucide-react';
import Header from '@/components/header';
import toast, { Toaster } from 'react-hot-toast';

interface ContactFormData {
    name: string;
    company_name: string;
    email: string;
    phone: string;
    message: string;
}

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm<ContactFormData>({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleInputChange = (field: keyof ContactFormData) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setData(field, e.target.value);
        };
 

    const { props } = usePage<{
        flash: {
            success?: string;
            error?: string;
        };
    }>();

    const flash = props.flash;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);
 
    return (
        
        <>
            <Head title="Contact Us" />

            {/* 👇 Global toast notification system */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#1e293b',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        padding: '12px 16px',
                        fontSize: '0.9rem'
                    },
                    success: {
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#fff'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fff'
                        }
                    }
                }}
            />

            <Header />

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50 py-12 bg-hero">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Contact Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-brandblue mb-2">Contact Us</h1>
                        </div>

                        {/* Contact Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-brandblue font-medium">
                                    Name*
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={handleInputChange('name')}
                                    required
                                    className="h-12 border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-600 focus:ring-0 bg-transparent"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Company Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="company_name" className="text-brandblue font-medium">
                                    Company Name*
                                </Label>
                                <Input
                                    id="company_name"
                                    type="text"
                                    value={data.company_name}
                                    onChange={handleInputChange('company_name')}
                                    required
                                    className="h-12 border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-600 focus:ring-0 bg-transparent"
                                />
                                <InputError message={errors.company_name} />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-brandblue font-medium">
                                    Email*
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={handleInputChange('email')}
                                    required
                                    className="h-12 border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-600 focus:ring-0 bg-transparent"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-brandblue font-medium">
                                    Phone*
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={handleInputChange('phone')}
                                    required
                                    className="h-12 border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-600 focus:ring-0 bg-transparent"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            {/* Message Field */}
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-brandblue font-medium">
                                    Your Message*
                                </Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={handleInputChange('message')}
                                    required
                                    rows={6}
                                    className="border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-600 focus:ring-0 bg-transparent resize-none"
                                />
                                <InputError message={errors.message} />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-brandblue hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    SUBMIT ▶
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
