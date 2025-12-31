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
import { roleSchema, type RoleFormValues } from './form-schema';
import { TRole } from '../types';
import RoleController from '@/actions/App/Http/Controllers/IAM/RoleController';

type EditRoleFormDialogProps = {
    role: TRole;
};

export const EditRoleFormDialog = ({ role }: EditRoleFormDialogProps) => {
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: role.name,
            guard_name: role.guard_name,
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (isDialogOpen) {
            form.reset({
                name: role.name,
                guard_name: role.guard_name,
            });
        }
    }, [isDialogOpen, role, form]);

    const handleSubmit = (values: RoleFormValues) => {
        router.put(RoleController.update({ role: role.id }).url, values, {
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Berhasil memperbarui role');
            },
            onError: () => {
                toast.error('Gagal memperbarui role');
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
                <DialogContent aria-describedby="edit-role-description">
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription id="edit-role-description">
                            Perbarui data role pada form di bawah ini.
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
                                                placeholder="ex: Admin"
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
