import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginationMeta } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { TWeaponTransferRequest } from '@/types/entities/weapon';
import DataTable from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permintaan Transfer Senjata',
        href: '/weapons/transfer-requests',
    },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'draft': return 'secondary';
        case 'pending': return 'warning';
        case 'approved': return 'success';
        case 'rejected': return 'destructive';
        default: return 'default';
    }
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        'draft': 'Draft',
        'pending': 'Menunggu',
        'approved': 'Disetujui',
        'rejected': 'Ditolak',
    };
    return labels[status] || status;
};

const TransferRequestsPage = () => {
    const page = usePage<{ data: PaginationMeta<TWeaponTransferRequest> }>();
    const [approveDialog, setApproveDialog] = useState<number | null>(null);
    const [rejectDialog, setRejectDialog] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleApprove = (id: number) => {
        router.post(`/weapons/transfer-requests/${id}/approve`, {}, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onSuccess: () => {
                setApproveDialog(null);
                toast.success('Permintaan transfer berhasil disetujui');
            },
            onError: () => {
                toast.error('Gagal menyetujui permintaan transfer');
            },
        });
    };

    const handleReject = (id: number) => {
        router.post(`/weapons/transfer-requests/${id}/reject`, 
            { rejection_reason: rejectionReason }, 
            {
                preserveState: true,
                replace: true,
                only: ['data'],
                onSuccess: () => {
                    setRejectDialog(null);
                    setRejectionReason('');
                    toast.success('Permintaan transfer ditolak');
                },
                onError: () => {
                    toast.error('Gagal menolak permintaan transfer');
                },
            }
        );
    };

    const columns: ColumnDef<TWeaponTransferRequest>[] = [
        {
            accessorKey: 'request_number',
            header: 'Nomor Request',
            cell: ({ row }) => row.original.request_number || '-',
        },
        {
            accessorKey: 'weapon.name',
            header: 'Senjata',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.weapon?.name}</div>
                    <div className="text-sm text-muted-foreground">{row.original.weapon?.code}</div>
                </div>
            ),
        },
        {
            accessorKey: 'from_warehouse.name',
            header: 'Dari Gudang',
            cell: ({ row }) => row.original.from_warehouse?.name || '-',
        },
        {
            accessorKey: 'to_warehouse.name',
            header: 'Ke Gudang',
            cell: ({ row }) => row.original.to_warehouse?.name || '-',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={getStatusVariant(row.original.status) as any}>
                    {getStatusLabel(row.original.status)}
                </Badge>
            ),
        },
        {
            accessorKey: 'submitted_at',
            header: 'Tanggal Pengajuan',
            cell: ({ row }) => row.original.submitted_at 
                ? new Date(row.original.submitted_at).toLocaleDateString('id-ID')
                : '-',
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                if (row.original.status !== 'pending') return null;
                
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setApproveDialog(row.original.id)}
                        >
                            <CheckCircle className="h-4 w-4" />
                            Setujui
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setRejectDialog(row.original.id)}
                        >
                            <XCircle className="h-4 w-4" />
                            Tolak
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permintaan Transfer Senjata" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable<TWeaponTransferRequest>
                    title="Permintaan Transfer Senjata"
                    columns={columns}
                    data={page.props.data.data}
                />
            </div>

            {/* Approve Dialog */}
            <AlertDialog open={approveDialog !== null} onOpenChange={() => setApproveDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Setujui Permintaan Transfer?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Senjata akan dipindahkan ke gudang tujuan setelah disetujui.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => approveDialog && handleApprove(approveDialog)}>
                            Setujui
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog open={rejectDialog !== null} onOpenChange={() => setRejectDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak Permintaan Transfer?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Berikan alasan penolakan:
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Textarea
                        placeholder="Alasan penolakan..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="my-4"
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => rejectDialog && handleReject(rejectDialog)}
                            disabled={!rejectionReason.trim()}
                        >
                            Tolak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default TransferRequestsPage;
