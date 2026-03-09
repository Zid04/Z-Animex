import { Link } from '@inertiajs/react';
import { LayoutGrid, Film, ListChecks, Heart } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

/*
|--------------------------------------------------------------------------
| NAVIGATION ITEMS (Animex)
|--------------------------------------------------------------------------
*/

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Médias',
        href: '/media',
        icon: Film,
    },
    {
        title: 'Mes médias',
        href: '/my-media',
        icon: Heart,
    },
    {
        title: 'Watchlist',
        href: '/watchlist',
        icon: ListChecks,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* LOGO */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <img
                                    src="/logo.png"
                                    alt="Animex"
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* MAIN NAVIGATION */}
            <SidebarContent>
                <nav className="flex flex-col gap-1 px-2 py-4">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition"
                        >
                            {item.icon && <item.icon className="h-5 w-5" />}
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
