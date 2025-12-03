import DataTable from '@/components/data-table';
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
import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { BreadcrumbItem, PaginationMeta } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { columns } from './columns';
import { TUser } from './types';
import { toast } from 'sonner';
import { PlusCircleIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
];

const UserPage = () => {
    const page = usePage<{ data: PaginationMeta<TUser> }>();

    const handleSearch = (search: string) => {
        router.visit(users.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable<TUser>
                    onSearch={handleSearch}
                    title="Data User"
                    columns={columns}
                    data={page.props.data.data}
                    topActions={[<AddUserButton key="add-user" />]}
                />
            </div>
        </AppLayout>
    );
};



const AddUserButton = () => {
    const userSchema = z
        .object({
            name: z.string().min(1, 'Silakan masukkan nama'),
            email: z.string().email('Silakan masukkan email yang valid'),
            password: z
                .string()
                .min(6, 'Password harus terdiri dari minimal 6 karakter'),
            password_confirmation: z
                .string()
                .min(
                    6,
                    'Konfirmasi Password harus terdiri dari minimal 6 karakter',
                ),
        })
        .refine((data) => data.password === data.password_confirmation, {
            message: "Passwords don't match",
            path: ['password_confirmation'],
        });

    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (values: z.infer<typeof userSchema>) => {
        // Handle form submission logic here
        // For example, you can send the form data to the server
        router.post(users.store().url, values, {
            onSuccess: () => {
                form.reset();
                // close the dialog if needed
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan user baru');
            },
            onError: () => {
                // Handle validation errors if needed
                toast.error('Gagal menambahkan user baru');
            }
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Form {...form}>
                <DialogTrigger asChild>
                    <Button type="button" variant="default">
                        <PlusCircleIcon/>
                        Tambah User
                    </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="firdaus">
                    <DialogHeader>
                        <DialogTitle>Tambah User</DialogTitle>
                        <DialogDescription>
                            Isi data user baru pada form di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Form to add user goes here */}
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">
                                            Name
                                        </FormLabel>
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
                                        <FormLabel htmlFor="email">
                                            Email
                                        </FormLabel>
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
                                        <FormLabel htmlFor="password">
                                            Password
                                        </FormLabel>
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

export default UserPage;
