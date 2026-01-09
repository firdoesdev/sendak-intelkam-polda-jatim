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
import { dashboard } from '@/routes';
import roles from '@/routes/iam/roles';
import users from '@/routes/iam/users';
import permissions from '@/routes/iam/permissions';
import applicants from '@/routes/master-data/applicants';
import organizations from '@/routes/master-data/organizations';
import persons from '@/routes/master-data/persons';
import policeUnits from '@/routes/master-data/police-units';
import warehouses from '@/routes/master-data/warehouses';
import permits from '@/routes/permits';
import weapons from '@/routes/weapons';
import permitRenewals from '@/routes/permits/renewals';
import hibahTransfers from '@/routes/weapons/hibah-transfers';
import transferRequests from '@/routes/weapons/transfer-requests';
import kartuPengpin from '@/routes/kartu-pengpin';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    BookOpen,
    CreditCard,
    Folder,
    Gift,
    Key,
    LayoutGrid,
    RefreshCw,
    Shield,
    Users,
} from 'lucide-react';
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
        icon: Users,
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: Shield,
    },
    {
        title: 'Permissions',
        href: permissions.index(),
        icon: Key,
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
        title: 'Instansi / Organisasi',
        href: organizations.index(),
        icon: LayoutGrid,
    },
   
];



const weaponNavItems: NavItem[] = [
    {
        title: 'Data Senjata',
        href: weapons.index(),
        icon: Shield,
    },
    {
        title: 'Transfer Hibah',
        href: hibahTransfers.index(),
        icon: Gift,
    },
    {
        title: 'Permintaan Transfer',
        href: transferRequests.index(),
        icon: ArrowLeftRight,
    },
];

const permitsNavItems: NavItem[] = [
     {
        title: 'Data Pemohon',
        href: persons.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Permohonan Perizinan',
        href: applicants.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Data Perizinan',
        href: permits.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Perpanjangan Izin',
        href: permitRenewals.index(),
        icon: RefreshCw,
    },
   
];

const polsusNavItems: NavItem[] = [
     {
        title: 'Kartu Pengpin',
        href: kartuPengpin.index(),
        icon: CreditCard,
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
                <NavMain
                    groupLabel="Account & Permissions"
                    items={IamNavItems}
                />
                
                
                <NavMain groupLabel="Permohonan & Perizinan SENPI" items={permitsNavItems} />
                <NavMain groupLabel="Polsus" items={polsusNavItems} />
                <NavMain
                    groupLabel="Manajemen Senjata"
                    items={weaponNavItems}
                />
                <NavMain groupLabel="Master Data" items={masterNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
