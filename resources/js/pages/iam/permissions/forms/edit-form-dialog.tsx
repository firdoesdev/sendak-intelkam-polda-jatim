import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { permissionSchema, type PermissionFormValues } from './form-schema';
import { TPermission } from '../types';
import PermissionController from '@/actions/App/Http/Controllers/IAM/PermissionController';

type EditPermissionFormDialogProps = {
    permission: TPermission;
};

export const EditPermissionFormDialog = ({ permission }: EditPermissionFormDialogProps) => {
    const form = useForm<PermissionFormValues>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            name: permission.name,
            guard_name: permission.guard_name,
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (isDialogOpen) {
            form.reset({
                name: permission.name,
                guard_name: permission.guard_name,
            });
        }
    }, [isDialogOpen, permission, form]);

    const handleSubmit = (values: PermissionFormValues) => {
        router.put(PermissionController.update({ permission: permission.id }).url, values, {
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Berhasil memperbarui permission');
            },
            onError: () => {
                toast.error('Gagal memperbarui permission');
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Form {...form}>
                <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="edit-permission-description">
                    <DialogHeader>
                        <DialogTitle>Edit Permission</DialogTitle>
                        <DialogDescription id="edit-permission-description">
                            Perbarui data permission pada form di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="ex: manage-users"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="guard_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="guard_name">Guard Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="guard_name"
                                                placeholder="web"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    );
};
