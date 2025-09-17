import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import { TrendingUp, Building2, Users, Settings } from 'lucide-react';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'client'], // dono ko visible
    },
    {
        title: 'Stocks',
        href: '/stocks',
        icon: TrendingUp,
        roles: ['admin'], // sirf admin
    },
    {
        title: 'Company',
        href: '/company',
        icon: Building2,
        roles: ['admin'], // sirf admin
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
    const filteredNavItems = mainNavItems.filter(
        (item) => !item.roles || item.roles.includes(user.role)
    );


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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
