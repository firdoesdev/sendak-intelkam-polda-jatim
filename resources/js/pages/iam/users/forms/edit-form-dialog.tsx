import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import users from '@/routes/iam/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { userSchema } from './form-schema';
import { TDialogProps } from '../types';

export const EditUserForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: row?.original.name || '',
            email: row?.original.email || '',
            password: '',
            password_confirmation: '',
        },
    });

    const handleSubmit = (values: z.infer<typeof userSchema>) => {
        // Filter out empty password fields
        const data = { ...values };
        if (!data.password) {
            delete data.password;
            delete data.password_confirmation;
        }

        router.put(users.update(row.original.id).url, data, {
            onProgress: () => {
                form.reset();
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil mengupdate user');
            },
            onError: () => {
                toast.error('Gagal mengupdate user');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby="edit-user-description">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription id="edit-user-description">
                        Edit data user pada form di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="edit-name">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="edit-name"
                                                placeholder="ex: John Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="edit-email">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="edit-email"
                                                type="email"
                                                placeholder="ex: hello@world.co"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="edit-password">
                                            Password (kosongkan jika tidak ingin mengubah)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="edit-password"
                                                type="password"
                                                placeholder="Enter new password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password_confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="edit-password-confirmation">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="edit-password-confirmation"
                                                type="password"
                                                placeholder="Confirm new password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                            <Button type="submit" variant="default">
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
