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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import users from '@/routes/users';
import { router } from '@inertiajs/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TUser } from './types';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';

type TDialogProps = {
    row: Row<TUser>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DeleteUserDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const handleDelete = () => {
        router.delete(users.destroy(row?.original.id), {
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

const EditUserDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const formSchema = z.object({
        name: z.string().min(2, 'Nama harus terdiri dari minimal 2 karakter'),
    });
    // Implementation for updating user goes here
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: row?.original.name ?? '',
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        // Handle form submission logic here
        // For example, you can send the form data to the server
        router.put(users.update(row?.original.id).url, values, {
            onSuccess: () => {
                form.reset();
                // close the dialog if needed
                onOpenChange(false);
                toast.success('Berhasil memperbarui user');
            },
            onError: () => {
                // Handle validation errors if needed
                toast.error('Gagal memperbarui user');
            }
        });
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Edit data user pada form di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        {/* Form to update user goes here */}
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

                        </div>
                        <DialogFooter className='mt-4'>
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
}

const ActionsCell = ({ row }: { row: Row<TUser> }) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDeleteDialog(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteUserDialog
                row={row}
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
            />
            <EditUserDialog
                row={row}
                open={editDialog}
                onOpenChange={setEditDialog}
            />
        </>
    );
};

export const columns: ColumnDef<TUser>[] = [
    {
        accessorKey: 'id',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
   
    {
        accessorKey: 'default_division',
        header: 'Default Division',
        cell: ({ row }) => row.original.default_division_id ? row.original.default_division?.name : '-',
    },
    {
        accessorKey: 'police_unit',
        header: 'Police Unit',
        cell: ({ row }) => row.original.police_unit_id ? row.original.police_unit?.name : '-',
    },
    
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell row={row} />,
    },
];
