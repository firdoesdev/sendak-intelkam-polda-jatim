import organizations from '@/routes/master-data/organizations';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { TDialogProps } from '../types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';


export const DeleteOrganizationDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const handleDelete = () => {
        router.delete(organizations.destroy(row?.original.id), {
            preserveState: true,
            replace: true,
            only: ['data'],
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil menghapus organisasi');
            },
            onError: () => {
                toast.error('Gagal menghapus organisasi');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Apakah Anda yakin ingin menghapus organisasi ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
                        menghapus organisasi dan menghapus data mereka dari sistem.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
