import persons from '@/routes/master-data/persons';
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

export const DeletePersonDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const handleDelete = () => {
        router.delete(persons.destroy(row?.original.id), {
            preserveState: true,
            replace: true,
            only: ['data'],
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil menghapus person');
            },
            onError: () => {
                toast.error('Gagal menghapus person');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Apakah Anda yakin ingin menghapus person ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Data person akan dihapus secara permanen.
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
