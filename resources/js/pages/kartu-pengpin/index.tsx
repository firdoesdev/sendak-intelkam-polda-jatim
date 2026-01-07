import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import kartuPengpin from '@/routes/kartu-pengpin';
import { BreadcrumbItem, PaginationMeta } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Printer } from 'lucide-react';

interface KartuPengpin {
    id: number;
    card_number: string;
    permit_id: number;
    person_id: number;
    weapon_id: number;
    issued_at: string;
    expired_at: string;
    status: string;
    status_label: string;
    status_variant: string;
    revoked_at: string | null;
    revoked_by: number | null;
    revoke_reason: string | null;
    created_at: string;
    permit: {
        id: number;
        permit_number: string;
        permit_type: string;
    };
    person: {
        id: number;
        name: string;
        nik: string;
    };
    weapon: {
        id: number;
        serial_number: string;
        brand: string;
        model: string;
    };
}

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
    const page = usePage<{ data: PaginationMeta<KartuPengpin> }>();

    const columns: ColumnDef<KartuPengpin>[] = [
        {
            accessorKey: 'card_number',
            header: 'Nomor Kartu',
            cell: ({ row }) => (
                <div className="font-mono font-medium">
                    {row.original.card_number}
                </div>
            ),
        },
        {
            accessorKey: 'person.name',
            header: 'Pemilik',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">
                        {row.original.person.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.person.nik}
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
                        {row.original.weapon.brand} {row.original.weapon.model}
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
            accessorKey: 'expired_at',
            header: 'Masa Berlaku',
            cell: ({ row }) => {
                const expired = isExpired(row.original.expired_at);
                const expiringSoon = isExpiringSoon(row.original.expired_at);

                return (
                    <div>
                        <div className="font-medium">
                            {new Date(
                                row.original.expired_at,
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
                        <Button key="create" asChild>
                            <Link href="/kartu-pengpin/create">
                                Buat Kartu Pengpin
                            </Link>
                        </Button>,
                    ]}
                />
            </div>
        </AppLayout>
    );
};

export default KartuPengpinIndexPage;
