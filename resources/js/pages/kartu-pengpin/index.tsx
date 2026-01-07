import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import kartuPengpin from '@/routes/kartu-pengpin';
import { BreadcrumbItem, PaginationMeta } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Printer } from 'lucide-react';
import { TKartuPengpin } from './types';
import { CreateFormDialog } from './dialogs/create-form-dialog';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Izin',
        href: '/permits',
    },
    {
        title: 'Kartu Pengpin',
        href: '/kartu-pengpin',
    },
];

const isExpiringSoon = (expiredAt: string) => {
    const expiry = new Date(expiredAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
        (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
};

const isExpired = (expiredAt: string) => {
    return new Date(expiredAt) < new Date();
};

const KartuPengpinIndexPage = () => {
    const page = usePage<{ 
        data: PaginationMeta<TKartuPengpin>;
        permits: Array<{
            id: number;
            permit_number: string;
            permit_type: string;
        }>;
        persons: Array<{
            id: number;
            full_name: string;
            national_id: string;
        }>;
        weapons: Array<{
            id: number;
            serial_number: string;
            name: string;
        }>;
    }>();

    const columns: ColumnDef<TKartuPengpin>[] = [
        {
            accessorKey: 'pengpin_number',
            header: 'Nomor Kartu',
            cell: ({ row }) => (
                <div className="font-mono font-medium">
                    {row.original.pengpin_number}
                </div>
            ),
        },
        {
            accessorKey: 'person.full_name',
            header: 'Pemilik',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">
                        {row.original.person.full_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.person.national_id}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'weapon.serial_number',
            header: 'Senjata',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">
                        {row.original.weapon.serial_number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.weapon.manufacturer} {row.original.weapon.name}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'permit.permit_number',
            header: 'Izin',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">
                        {row.original.permit.permit_number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.permit.permit_type}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'expiry_date',
            header: 'Masa Berlaku',
            cell: ({ row }) => {
                const expired = isExpired(row.original.expiry_date);
                const expiringSoon = isExpiringSoon(row.original.expiry_date);

                return (
                    <div>
                        <div className="font-medium">
                            {new Date(
                                row.original.expiry_date,
                            ).toLocaleDateString('id-ID')}
                        </div>
                        {expired && (
                            <Badge
                                variant="destructive"
                                className="mt-1 text-xs"
                            >
                                Kadaluarsa
                            </Badge>
                        )}
                        {!expired && expiringSoon && (
                            <Badge
                                variant="secondary"
                                className="mt-1 bg-yellow-500 text-xs text-white"
                            >
                                Segera Habis
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.status_variant as "default" | "secondary" | "destructive" | "outline" | null | undefined}>
                    {row.original.status_label}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={kartuPengpin.show(row.original.id).url}>
                            <Eye className="mr-1 h-4 w-4" />
                            Lihat
                        </Link>
                    </Button>
                    {row.original.status === 'active' && (
                        <Button variant="secondary" size="sm" asChild>
                            <Link
                                href={kartuPengpin.print(row.original.id).url}
                                target="_blank"
                            >
                                <Printer className="mr-1 h-4 w-4" />
                                Cetak
                            </Link>
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kartu Pengpin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    title="Kartu Pengawasan & Pengendalian (Kartu Pengpin)"
                    columns={columns}
                    data={page.props.data.data}              
                    topActions={[
                        <CreateFormDialog 
                            key="create-form-dialog" 
                            permits={page.props.permits}
                            persons={page.props.persons}
                            weapons={page.props.weapons}
                        />,
                    ]}
                />
            </div>
        </AppLayout>
    );
};

export default KartuPengpinIndexPage;
