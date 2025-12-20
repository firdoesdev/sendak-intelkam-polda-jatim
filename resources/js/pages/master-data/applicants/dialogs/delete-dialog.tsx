import applicants from '@/routes/master-data/applicants';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { TDialogProps } from '../types';
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

export const DeleteApplicantDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const handleDelete = () => {
        router.delete(applicants.destroy(row?.original.id), {
            preserveState: true,
            replace: true,
            only: ['data'],
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil menghapus pemohon');
            },
            onError: () => {
                toast.error('Gagal menghapus pemohon');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Apakah Anda yakin ingin menghapus pemohon ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Data pemohon akan dihapus secara permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
