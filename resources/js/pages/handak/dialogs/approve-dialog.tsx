import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import handakPermits from '@/routes/handak-permits';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { TDialogProps } from '../types';

export const ApproveHandakPermitDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const permit = row.original;
    const isP2 = permit.recommendation_type === 'P2';

    const handleApprove = () => {
        router.post(handakPermits.approve(permit.id).url, {}, {
            preserveState: true,
            replace: true,
            only: ['data', 'parentOptions', 'stockBalances', 'errors'],
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Rekom handak disetujui');
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] || 'Gagal menyetujui rekom');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Setujui rekom ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Nomor rekom akan diterbitkan otomatis.
                        {isP2 &&
                            ' Karena ini rekom P2 (pembelian), stok bahan peledak perusahaan akan bertambah sesuai daftar bahan.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove}>Setujui</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
