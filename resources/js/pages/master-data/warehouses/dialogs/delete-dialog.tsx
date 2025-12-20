import warehouses from '@/routes/master-data/warehouses';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { TDialogProps } from '../types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';


export const DeleteWarehouseDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const handleDelete = () => {
        router.delete(warehouses.destroy(row?.original.id).url, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil menghapus gudang');
            },
            onError: () => {
                toast.error('Gagal menghapus gudang');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Apakah Anda yakin ingin menghapus gudang ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
                        menghapus data gudang dari sistem.
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
