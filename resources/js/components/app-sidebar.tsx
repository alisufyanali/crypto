import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Building2,
    TrendingUp,
    Users,
    ShoppingCart,
    FileText,
    ShieldCheck,
    Folder,
    MessageSquare
} from "lucide-react";

import AppLogo from './app-logo';
import { filterNavByRole } from '@/utils/nav-helpers';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: 'admin/dashboard',
        icon: LayoutGrid,
        roles: ['admin'],
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['client'],
    },
    {
        title: 'Company',
        href: '/companies',
        icon: Building2,
        roles: ['admin'],
    },
    {
        title: 'Stocks',
        href: '/stocks',
        icon: TrendingUp,
        roles: ['admin', 'broker'],
    },
    {
        title: 'Client',
        href: '/clients',
        icon: Users,
        roles: ['admin'],
    },
    {
        title: 'Users',
        href: '/users',
        icon: ShieldCheck,
        roles: ['admin'],
    },
    {
        title: 'Order',
        href: '/orders',
        icon: ShoppingCart,
        roles: ['admin'],
    },
    {
        title: 'Audit logs',
        href: '/audit-logs',
        icon: FileText,
        roles: ['admin'],
    },
    {
        title: 'Contact Forms',
        href: '/admin/contacts',
        icon: MessageSquare,
        roles: ['admin'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Test',
        href: '#',
        icon: Folder,
    }
];

export function AppSidebar() {
    // ✅ Get user from Inertia's page props
    const { auth } = usePage().props as any;
    const user = auth?.user;

    // ✅ Fallback if user is not available
    if (!user) {
        console.warn('User not found in page props');
        return (
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <p className="p-4 text-sm text-gray-500">Loading...</p>
                </SidebarContent>
            </Sidebar>
        );
    }

    // ✅ Get user role (handle both string and array)
    const userRole = user.roles?.[0]?.name || user.role || 'guest';

    // ✅ Filter navigation items based on user role
    const filteredNavItems = filterNavByRole(mainNavItems, userRole);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}