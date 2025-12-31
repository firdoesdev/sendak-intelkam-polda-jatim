import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { TPermission } from '../types';
import PermissionController from '@/actions/App/Http/Controllers/IAM/PermissionController';

type DeletePermissionDialogProps = {
    permission: TPermission;
};

export const DeletePermissionDialog = ({ permission }: DeletePermissionDialogProps) => {
    const handleDelete = () => {
        router.delete(PermissionController.destroy({ permission: permission.id }).url, {
            onSuccess: () => {
                toast.success('Berhasil menghapus permission');
            },
            onError: () => {
                toast.error('Gagal menghapus permission');
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Permission</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus permission "{permission.name}"? 
                        Tindakan ini tidak dapat dibatalkan.
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
