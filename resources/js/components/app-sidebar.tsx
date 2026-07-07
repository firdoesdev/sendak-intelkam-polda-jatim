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
import handakPermits from '@/routes/handak-permits';
import handakStock from '@/routes/handak-stock';
import permissions from '@/routes/iam/permissions';
import roles from '@/routes/iam/roles';
import users from '@/routes/iam/users';
import kartuPengpin from '@/routes/kartu-pengpin';
import applicants from '@/routes/master-data/applicants';
import organizations from '@/routes/master-data/organizations';
import persons from '@/routes/master-data/persons';
import policeUnits from '@/routes/master-data/police-units';
import warehouses from '@/routes/master-data/warehouses';
import permits from '@/routes/permits';
import permitRenewals from '@/routes/permits/renewals';
import weapons from '@/routes/weapons';
import hibahTransfers from '@/routes/weapons/hibah-transfers';
import transferRequests from '@/routes/weapons/transfer-requests';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Bomb,
    BookOpen,
    CreditCard,
    Folder,
    Gift,
    Key,
    LayoutGrid,
    Package,
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

const RolePermissionsNavItems: NavItem[] = [
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

const IamNavItems: NavItem[] = [
    {
        title: 'Users',
        href: users.index(),
        icon: Users,
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
        title: 'Data Profile',
        href: persons.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Pengajuan & Permohonan Ijin',
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

// const senpiNavItems: NavItem[] = [

// ];

const handakNavItems: NavItem[] = [
    {
        title: 'Rekom Handak',
        href: handakPermits.index(),
        icon: Bomb,
    },
    {
        title: 'Stok Bahan Peledak',
        href: handakStock.index(),
        icon: Package,
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
    const { props } = usePage<SharedData>();

    const { default_division, roles } = props.auth.user;

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

            {roles.length !== 0 ? (
                <SidebarContent>
                    <NavMain items={mainNavItems} />
                    <NavMain
                        groupLabel="Account & Permissions"
                        items={
                            roles.some((role) => role.name === 'super-admin')
                                ? [...IamNavItems, ...RolePermissionsNavItems]
                                : IamNavItems
                        }
                    />

                    <NavMain
                        groupLabel="Data Permohonan & Ijin"
                        items={permitsNavItems}
                    />

                    {/* Menu Senpi & Sport */}
                    {default_division?.code === 'senpi' ||
                    default_division?.code === 'sport' ||
                    roles.some((role) => role.name === 'senpi') ||
                    roles.some((role) => role.name === 'sport') ? (
                        <NavMain
                            groupLabel="Manajemen Senjata"
                            items={weaponNavItems}
                        />
                    ) : null}

                    {/* Polsus Menu */}
                    {default_division?.code === 'polsus' ||
                    roles.some((role) => role.name === 'polsus') ? (
                        <NavMain groupLabel="Polsus" items={polsusNavItems} />
                    ) : null}

                    {/* Handak Menu */}
                    {default_division?.code === 'handak' ||
                    roles.some((role) => role.name === 'handak') ? (
                        <NavMain groupLabel="Handak" items={handakNavItems} />
                    ) : null}

                    <NavMain groupLabel="Master Data" items={masterNavItems} />
                </SidebarContent>
            ) : null}

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
