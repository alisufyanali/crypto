import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast'; // 👈 Import this

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
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
    </AppLayoutTemplate>
);
