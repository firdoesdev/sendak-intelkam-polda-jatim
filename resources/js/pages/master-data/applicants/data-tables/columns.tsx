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
import { TApplicant, ApplicantTypeOptions } from '../types';
import { EditApplicantForm } from '../forms/edit-form-dialog';
import { DeleteApplicantDialog } from '../dialogs/delete-dialog';

const ActionsCell = ({ row }: { row: Row<TApplicant> }) => {
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
            <DeleteApplicantDialog
                key={row.original.id}
                row={row}
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
            />
            <EditApplicantForm
                key={row.original.id}
                row={row}
                open={editDialog}
                onOpenChange={setEditDialog}
            />
        </>
    );
};

export const columns: ColumnDef<TApplicant>[] = [
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
        accessorKey: 'display_name',
        header: 'Nama',
    },
    {
        accessorKey: 'applicant_type',
        header: 'Tipe',
        cell: ({ row }) => {
            const type = ApplicantTypeOptions.find(
                (opt) => opt.value === row.original.applicant_type
            );
            return <Badge variant="secondary">{type?.label || row.original.applicant_type}</Badge>;
        },
    },
    {
        id: 'details',
        header: 'Detail',
        cell: ({ row }) => {
            if (row.original.applicant_type === 'person' && row.original.person) {
                return (
                    <div className="text-sm">
                        <div className="font-medium">{row.original.person.full_name}</div>
                        {row.original.person.national_id && (
                            <div className="text-muted-foreground">
                                NIK: {row.original.person.national_id}
                            </div>
                        )}
                    </div>
                );
            }
            if (row.original.applicant_type === 'organization' && row.original.organization) {
                return (
                    <div className="text-sm">
                        <div className="font-medium">{row.original.organization.name}</div>
                        {row.original.organization.org_type && (
                            <div className="text-muted-foreground capitalize">
                                {row.original.organization.org_type}
                            </div>
                        )}
                    </div>
                );
            }
            return <span className="text-muted-foreground">-</span>;
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell key={row.original.id} row={row} />,
    },
];
