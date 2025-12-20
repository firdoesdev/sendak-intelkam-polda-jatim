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
import { TOrganization, OrgTypeOptions } from '../types';
import { EditOrganizationForm } from '../forms/edit-form-dialog';
import { DeleteOrganizationDialog } from '../dialogs/delete-dialog';



const ActionsCell = ({ row }: { row: Row<TOrganization> }) => {
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
            <DeleteOrganizationDialog
                key={row.original.id}
                row={row}
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
            />
            <EditOrganizationForm
                key={row.original.id}
                row={row}
                open={editDialog}
                onOpenChange={setEditDialog}
            />
        </>
    );
};

export const columns: ColumnDef<TOrganization>[] = [
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
        header: 'Nama',
    },
    {
        accessorKey: 'org_type',
        header: 'Tipe Organisasi',
        cell: ({ row }) => {
            const orgType = OrgTypeOptions.find(opt => opt.value === row.original.org_type);
            return <Badge variant='secondary'>{orgType?.label || row.original.org_type}</Badge>;
        },
    },
    {
        accessorKey: 'registration_no',
        header: 'No. Registrasi',
    },
    {
        accessorKey: 'tax_no',
        header: 'NPWP',
    },
    {
        accessorKey: 'city',
        header: 'Kota',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell key={row.original.id} row={row} />,
    },
];
