import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import users from '@/routes/iam/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { userCreateSchema } from './form-schema';

export const CreateUserForm = () => {
    const form = useForm({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (values: z.infer<typeof userCreateSchema>) => {
        router.post(users.store().url, values, {
            onSuccess: () => {
                form.reset();
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan user baru');
            },
            onError: () => {
                toast.error('Gagal menambahkan user baru');
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Form {...form}>
                <DialogTrigger asChild>
                    <Button type="button" variant="default">
                        <PlusCircleIcon />
                        Tambah User
                    </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="add-user-description">
                    <DialogHeader>
                        <DialogTitle>Tambah User</DialogTitle>
                        <DialogDescription id="add-user-description">
                            Isi data user baru pada form di bawah ini.
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
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
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
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter your password"
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
                                        <FormLabel htmlFor="password_confirmation">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                placeholder="Confirm your password"
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
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    );
};
