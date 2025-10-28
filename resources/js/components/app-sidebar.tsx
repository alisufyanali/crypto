import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Building2,
    TrendingUp,
    Users,
    ShoppingCart,
    FileText,
    ShieldCheck, Folder, Settings
} from "lucide-react";

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'client'],
    },
    {
        title: 'Company',
        href: '/companies',
        icon: Building2, // 🏢 Company ke liye best fit
        roles: ['admin'],
    },
    {
        title: 'Stocks',
        href: '/stocks',
        icon: TrendingUp, // 📈 Financial growth icon
        roles: ['admin', 'broker'],
    },
    {
        title: 'Client',
        href: '/clients',
        icon: Users, // 👥 Clients = Users icon
        roles: ['admin'],
    },
    {
        title: 'Users',
        href: '/users',
        icon: ShieldCheck, // 👤 + Security/Admin vibes
        roles: ['admin'],
    },
    {
        title: 'Order',
        href: '/orders',
        icon: ShoppingCart, // 🛒 Clear e-commerce/order meaning
        roles: ['admin'],
    },
    {
        title: 'Audit logs',
        href: '/audit-logs',
        icon: FileText, // 📜 Log/document style
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

export function AppSidebar({ user }: { user: { role: string } }) {

    // const filteredNavItems = mainNavItems.filter(
    //     (item) => !item.roles || item.roles.includes(user.role)
    // );
    const filteredNavItems = mainNavItems;

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
