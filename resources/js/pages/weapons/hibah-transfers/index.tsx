import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginationMeta } from '@/types';
import { Head, usePage, router, Link } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import hibahTransfers from '@/routes/weapons/hibah-transfers';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface WeaponHibahTransfer {
    id: number;
    weapon_id: number;
    from_person_id: number;
    from_permit_id: number;
    to_person_id: number;
    to_permit_id: number | null;
    transfer_reason: string;
    status: string;
    status_label: string;
    status_variant: string;
    submitted_at: string | null;
    approved_at: string | null;
    approved_by: number | null;
    approval_notes: string | null;
    created_at: string;
    weapon: {
        id: number;
        serial_number: string;
        brand: string;
        model: string;
        caliber: string;
    };
    from_person: {
        id: number;
        name: string;
        nik: string;
    };
    to_person: {
        id: number;
        name: string;
        nik: string;
    };
    from_permit: {
        id: number;
        permit_number: string;
    };
    to_permit: {
        id: number;
        permit_number: string;
    } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Senjata',
        href: '/weapons',
    },
    {
        title: 'Transfer Hibah',
        href: '/weapons/hibah-transfers',
    },
];

const HibahTransfersIndexPage = () => {
    const page = usePage<{ data: PaginationMeta<WeaponHibahTransfer> }>();
    const [submitDialog, setSubmitDialog] = useState<number | null>(null);

    const handleSubmit = (id: number) => {
        router.post(hibahTransfers.submit(id).url, {}, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onSuccess: () => {
                setSubmitDialog(null);
                toast.success('Transfer hibah berhasil diajukan');
            },
            onError: () => {
                toast.error('Gagal mengajukan transfer hibah');
            },
        });
    };

    const columns: ColumnDef<WeaponHibahTransfer>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'weapon.serial_number',
            header: 'Senjata',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.weapon.serial_number}</div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.weapon.brand} {row.original.weapon.model}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'from_person.name',
            header: 'Dari',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.from_person.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.from_permit.permit_number}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'to_person.name',
            header: 'Kepada',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.to_person.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.to_permit?.permit_number || 'Belum ada izin'}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.status_variant as any}>
                    {row.original.status_label}
                </Badge>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Dibuat',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('id-ID'),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={hibahTransfers.show(row.original.id).url}>
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat
                        </Link>
                    </Button>
                    {row.original.status === 'draft' && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => setSubmitDialog(row.original.id)}
                        >
                            <Send className="h-4 w-4 mr-1" />
                            Ajukan
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transfer Hibah Senjata" />

            <DataTable
                title="Transfer Hibah Senjata"
                columns={columns}
                data={page.props.data.data}
                topActions={[
                    <Button key="create" asChild>
                        <Link href="/weapons/hibah-transfers/create">
                            Buat Transfer Hibah
                        </Link>
                    </Button>,
                ]}
            />

            <AlertDialog open={submitDialog !== null} onOpenChange={() => setSubmitDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ajukan Transfer Hibah</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mengajukan transfer hibah ini? 
                            Status akan berubah menjadi "Menunggu Persetujuan" dan tidak dapat diubah lagi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => submitDialog && handleSubmit(submitDialog)}>
                            Ya, Ajukan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default HibahTransfersIndexPage;
