import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginationMeta } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { TPermitRenewal } from '@/types/entities/permit-renewal';
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

import permitRenewal from '@/routes/permits/renewals'


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perpanjangan Izin',
        href: '/permits/renewals',
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

const PermitRenewalsPage = () => {
    const page = usePage<{ data: PaginationMeta<TPermitRenewal> }>();
    const [approveDialog, setApproveDialog] = useState<number | null>(null);
    const [rejectDialog, setRejectDialog] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Force render to see if component loads
    // if (typeof window !== 'undefined') {
    //     console.log('Component loaded!');
    //     console.log('Page props:', page.props);
    //     console.log('Data:', page.props.data);
    // }

    const handleApprove = (id: number) => {
        const permitRenewalApprove = permitRenewal.approve(id)
        router.post(permitRenewalApprove.url, {}, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onError: () => {
                toast.error('Gagal menyetujui perpanjangan izin');
            },
            onSuccess: (response) => {
                
               switch (response.flash?.key) {
                    case 'success':
                        toast.success(response.flash.message as string);
                        break;
                
                    default:
                        toast.error(response.flash.message as string);
                        break;
                }
                setApproveDialog(null);
            },
        });
    };

    const handleReject = (id: number) => {
        router.post(`/renewals-permits/${id}/reject`, 
            { rejection_reason: rejectionReason }, 
            {
                preserveState: true,
                replace: true,
                only: ['data'],
                onSuccess: () => {
                    setRejectDialog(null);
                    setRejectionReason('');
                    toast.success('Perpanjangan izin ditolak');
                },
                onError: () => {
                    toast.error('Gagal menolak perpanjangan izin');
                },
            }
        );
    };

    const columns: ColumnDef<TPermitRenewal>[] = [
        {
            accessorKey: 'renewal_number',
            header: 'Nomor Renewal',
            cell: ({ row }) => row.original.renewal_number || '-',
        },
        {
            accessorKey: 'permit.permit_number',
            header: 'Nomor Izin',
            cell: ({ row }) => row.original.permit?.permit_number || '-',
        },
        {
            accessorKey: 'current_valid_to',
            header: 'Berlaku Hingga (Saat Ini)',
            cell: ({ row }) => new Date(row.original.current_valid_to).toLocaleDateString('id-ID'),
        },
        {
            accessorKey: 'new_valid_to',
            header: 'Berlaku Hingga (Baru)',
            cell: ({ row }) => new Date(row.original.new_valid_to).toLocaleDateString('id-ID'),
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
            <Head title="Perpanjangan Izin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {page.props.data ? (
                    <DataTable<TPermitRenewal>
                        title="Perpanjangan Izin"
                        columns={columns}
                        data={page.props.data.data || []}
                    />
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            {/* Approve Dialog */}
            <AlertDialog open={approveDialog !== null} onOpenChange={() => setApproveDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Setujui Perpanjangan Izin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tanggal berlaku izin akan diperbarui setelah disetujui.
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
                        <AlertDialogTitle>Tolak Perpanjangan Izin?</AlertDialogTitle>
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

export default PermitRenewalsPage;
