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
import users from '@/routes/iam/users';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { TDialogProps } from '../types';

export const DeleteUserDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const handleDelete = () => {
        router.delete(users.destroy(row?.original.id), {
            preserveState: true,
            replace: true,
            only: ['data'],
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil menghapus user');
            },
            onError: () => {
                toast.error('Gagal menghapus user');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Apakah Anda yakin ingin menghapus user ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
                        menghapus akun user dan menghapus data mereka dari sistem.
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
