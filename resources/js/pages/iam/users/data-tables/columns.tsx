import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TUser } from '../types';
import { DeleteUserDialog } from '../dialogs/delete-dialog';
import { EditUserForm } from '../forms/edit-form-dialog';

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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setEditDialog(true)}>
                        Edit
                    </DropdownMenuItem>
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
            <EditUserForm row={row} open={editDialog} onOpenChange={setEditDialog} />
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
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => {
            const roles = row.original.roles || [];
            return roles.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                    {roles.map((role) => (
                        <span
                            key={role.id}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                            {role.name}
                        </span>
                    ))}
                </div>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    },
    {
        accessorKey: 'default_division',
        header: 'Default Division',
        cell: ({ row }) =>
            row.original.default_division_id
                ? row.original.default_division?.name
                : '-',
    },
    {
        accessorKey: 'police_unit',
        header: 'Police Unit',
        cell: ({ row }) =>
            row.original.police_unit_id ? row.original.police_unit?.name : '-',
    },

    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell row={row} />,
    },
];
