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
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { permissionSchema, type PermissionFormValues } from './form-schema';
import PermissionController from '@/actions/App/Http/Controllers/IAM/PermissionController';

export const CreatePermissionFormDialog = () => {
    const form = useForm<PermissionFormValues>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            name: '',
            guard_name: 'web',
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (values: PermissionFormValues) => {
        router.post(PermissionController.store().url, values, {
            onSuccess: () => {
                form.reset();
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan permission baru');
            },
            onError: () => {
                toast.error('Gagal menambahkan permission baru');
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Form {...form}>
                <DialogTrigger asChild>
                    <Button type="button" variant="default">
                        <PlusCircleIcon />
                        Tambah Permission
                    </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="add-permission-description">
                    <DialogHeader>
                        <DialogTitle>Tambah Permission</DialogTitle>
                        <DialogDescription id="add-permission-description">
                            Isi data permission baru pada form di bawah ini.
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
