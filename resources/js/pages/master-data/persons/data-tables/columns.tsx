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
import { Badge } from '@/components/ui/badge';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TPerson, GenderOptions } from '../types';
import { EditPersonForm } from '../forms/edit-form-dialog';
import { DeletePersonDialog } from '../dialogs/delete-dialog';

const ActionsCell = ({ row }: { row: Row<TPerson> }) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);

    return (
        <>
            <DropdownMenu modal={false} key={row.original.id}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDeleteDialog(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeletePersonDialog
                key={row.original.id}
                row={row}
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
            />
            <EditPersonForm
                key={row.original.id}
                row={row}
                open={editDialog}
                onOpenChange={setEditDialog}
            />
        </>
    );
};

export const columns: ColumnDef<TPerson>[] = [
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
        accessorKey: 'full_name',
        header: 'Nama Lengkap',
    },
    {
        accessorKey: 'national_id',
        header: 'NIK/NRP',
        cell: ({ row }) => row.original.national_id || '-',
    },
    {
        accessorKey: 'gender',
        header: 'Jenis Kelamin',
        cell: ({ row }) => {
            const gender = GenderOptions.find(
                (opt) => opt.value === row.original.gender
            );
            return <Badge variant="outline">{gender?.label || row.original.gender}</Badge>;
        },
    },
    {
        accessorKey: 'job_title',
        header: 'Jabatan',
        cell: ({ row }) => row.original.job_title || '-',
    },
    {
        id: 'affiliation',
        header: 'Afiliasi',
        cell: ({ row }) => {
            const items = [];
            if (row.original.police_unit) {
                items.push(
                    <Badge key="police" variant="secondary">
                        {row.original.police_unit.name}
                    </Badge>
                );
            }
            if (row.original.organization) {
                items.push(
                    <Badge key="org" variant="secondary">
                        {row.original.organization.name}
                    </Badge>
                );
            }
            return items.length > 0 ? <div className="flex gap-1 flex-wrap">{items}</div> : '-';
        },
    },
    {
        id: 'actions',
        cell: ActionsCell,
    },
];
