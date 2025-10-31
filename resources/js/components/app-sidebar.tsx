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
    MessageSquare,
    Bell,
    Briefcase,
} from "lucide-react";


import AppLogo from './app-logo';
import { filterNavByRole } from '@/utils/nav-helpers';

const iconMap: Record<string, any> = {
  dashboard: LayoutGrid,
  company: Building2,
  stocks: TrendingUp,
  client: Users,
  users: ShieldCheck,
  order: ShoppingCart,
  audit: FileText,
  contact: MessageSquare,
  notifications: Bell,
  portfolio: Briefcase,
};

const rawNavItems = [
  { title: 'Dashboard', href: 'admin/dashboard', roles: ['admin'] },
  { title: 'Dashboard', href: '/dashboard', roles: ['client'] },
  { title: 'Company', href: '/companies', roles: ['admin', 'broker'] },
  { title: 'Stocks', href: '/stocks', roles: ['admin', 'broker'] },
  { title: 'Client', href: '/clients', roles: ['admin', 'broker'] },
  { title: 'Users', href: '/users', roles: ['admin', 'broker'] },
  { title: 'Order', href: '/orders', roles: ['admin', 'broker', 'client'] },
  { title: 'Audit Logs', href: '/audit-logs', roles: ['admin'] },
  { title: 'Contact Forms', href: '/admin/contacts', roles: ['admin', 'broker'] },
  { title: 'Notifications', href: '/notifications', roles: ['admin', 'broker', 'client'] },
  { title: 'Portfolio', href: '/portfolio', roles: ['admin', 'broker', 'client'] },
];

const mainNavItems: NavItem[] = rawNavItems.map((item) => {
  const key = item.title.toLowerCase();
  const match = Object.keys(iconMap).find((iconKey) => key.includes(iconKey));
  return {
    ...item,
    icon: match ? iconMap[match] : Folder, // default icon agar match na mile
  };
});


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