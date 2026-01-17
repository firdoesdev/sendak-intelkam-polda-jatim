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
import { TPermit, PermitTypeOptions, PermitStatusOptions, EnumPermitStatus } from '../types';
import { EditPermitForm } from '../forms/edit-form-dialog';
import { DeletePermitDialog } from '../dialogs/delete-dialog';
import { RenewalFormDialog } from '../forms/renewal-form-dialog';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const ActionsCell = ({ row }: { row: Row<TPermit> }) => {
    const props = usePage<SharedData>().props;
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [renewalDialog, setRenewalDialog] = useState(false);
    
    // Check If Expired and User Has Ability to Request Renewal
    const canRenew = row.original.status === EnumPermitStatus.EXPIRED && props.auth.abilities?.['request-permit-renewals'];

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
                    {canRenew && (
                        <DropdownMenuItem onSelect={() => setRenewalDialog(true)}>
                            Perpanjang Izin
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDeleteDialog(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeletePermitDialog
                key={row.original.id}
                row={row}
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
            />
            <EditPermitForm
                key={row.original.id}
                row={row}
                open={editDialog}
                onOpenChange={setEditDialog}
            />
            {canRenew && (
                <RenewalFormDialog
                    key={`renewal-${row.original.id}`}
                    permit={row.original}
                    open={renewalDialog}
                    onOpenChange={setRenewalDialog}
                />
            )}
        </>
    );
};

export const columns: ColumnDef<TPermit>[] = [
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
        accessorKey: 'permit_number',
        header: 'No. Izin',
        cell: ({ row }) => (
            <span className="font-mono text-sm">
                {row.original.permit_number || '-'}
            </span>
        ),
    },
    {
        accessorKey: 'applicant',
        header: 'Pemohon',
        cell: ({ row }) => row.original.applicant?.display_name || '-',
    },
    {
        accessorKey: 'division',
        header: 'Divisi',
        cell: ({ row }) => row.original.division?.name || '-',
    },
    {
        accessorKey: 'permit_type',
        header: 'Tipe Izin',
        cell: ({ row }) => {
            const type = PermitTypeOptions.find(
                (opt) => opt.value === row.original.permit_type
            );
            return <Badge variant="outline">{type?.label || row.original.permit_type}</Badge>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = PermitStatusOptions.find(
                (opt) => opt.value === row.original.status
            );
            return (
                <Badge variant={(status?.variant as "secondary" | "destructive" | "outline" | "default") || "default"}>
                    {status?.label || row.original.status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'valid_from',
        header: 'Berlaku Dari',
        cell: ({ row }) => {
            if (!row.original.valid_from) return '-';
            return new Date(row.original.valid_from).toLocaleDateString('id-ID');
        },
    },
    {
        accessorKey: 'valid_to',
        header: 'Berlaku Hingga',
        cell: ({ row }) => {
            if (!row.original.valid_to) return '-';
            return new Date(row.original.valid_to).toLocaleDateString('id-ID');
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell key={row.original.id} row={row} />,
    },
];
