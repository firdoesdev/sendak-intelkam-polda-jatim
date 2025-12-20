import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import { dashboard,  } from '@/routes';
import users from '@/routes/iam/users';
import roles from '@/routes/iam/roles';
import policeUnits from '@/routes/master-data/police-units';
import warehouses from '@/routes/master-data/warehouses';
import organizations from '@/routes/master-data/organizations';
import applicants from '@/routes/master-data/applicants';
import permits from '@/routes/permits';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const IamNavItems: NavItem[] = [
   
     {
        title: 'Users',
        href: users.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: LayoutGrid,
    },
];


const masterNavItems: NavItem[] = [
   
     {
        title: 'Markas Kepolisian',
        href: policeUnits.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Gudang Senjata',
        href: warehouses.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Organisasi',
        href: organizations.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Pemohon',
        href: applicants.index(),
        icon: LayoutGrid,
    },
   
];

const permitNavItems: NavItem[] = [
    {
        title: 'Data Izin',
        href: permits.index(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavMain groupLabel='Account & Permissions' items={IamNavItems} />
                <NavMain groupLabel='Master Data' items={masterNavItems} />
                <NavMain groupLabel='Perizinan' items={permitNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
