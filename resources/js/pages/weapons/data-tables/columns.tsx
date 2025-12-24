import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TWeapon } from '../types';
import { EditWeaponForm } from '../forms/edit-form-dialog';
import { DeleteWeaponDialog } from '../dialogs/delete-dialog';

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'available': return 'success';
        case 'issued': return 'warning';
        case 'maintenance': return 'secondary';
        case 'decommissioned': return 'destructive';
        default: return 'default';
    }
};

const getConditionVariant = (condition: string) => {
    switch (condition) {
        case 'new': return 'default';
        case 'excellent': case 'good': return 'success';
        case 'fair': case 'poor': return 'warning';
        case 'damaged': return 'destructive';
        default: return 'secondary';
    }
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        'available': 'Tersedia',
        'issued': 'Dipinjamkan',
        'maintenance': 'Maintenance',
        'decommissioned': 'Tidak Aktif',
    };
    return labels[status] || status;
};

const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
        'new': 'Baru',
        'excellent': 'Sangat Baik',
        'good': 'Baik',
        'fair': 'Cukup',
        'poor': 'Kurang',
        'damaged': 'Rusak',
    };
    return labels[condition] || condition;
};

const getPermitTypeLabel = (permitType: string) => {
    const labels: Record<string, string> = {
        'SENPI': 'Senjata Api',
        'POLSUS': 'Kepolisian Khusus',
        'HANDAK': 'Perlengkapan dan Peralatan',
        'SPORT': 'Olahraga',
    };
    return labels[permitType] || permitType;
};

const ActionsCell = ({ row }: { row: Row<TWeapon> }) => {
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
            <DeleteWeaponDialog
                key={row.original.id}
                row={row}
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
            />
            <EditWeaponForm
                key={row.original.id}
                row={row}
                open={editDialog}
                onOpenChange={setEditDialog}
            />
        </>
    );
};

export const columns: ColumnDef<TWeapon>[] = [
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
        accessorKey: 'code',
        header: 'Kode',
    },
    {
        accessorKey: 'name',
        header: 'Nama Senjata',
    },
    {
        accessorKey: 'serial_number',
        header: 'Nomor Seri',
    },
    {
        accessorKey: 'permit_type',
        header: 'Tipe Izin',
        cell: ({ row }) => (
            <Badge variant='outline'>{getPermitTypeLabel(row.original.permit_type)}</Badge>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={getStatusVariant(row.original.status) as any}>
                {getStatusLabel(row.original.status)}
            </Badge>
        ),
    },
    {
        accessorKey: 'condition',
        header: 'Kondisi',
        cell: ({ row }) => (
            <Badge variant={getConditionVariant(row.original.condition) as any}>
                {getConditionLabel(row.original.condition)}
            </Badge>
        ),
    },
    {
        accessorKey: 'warehouse.name',
        header: 'Gudang',
        cell: ({ row }) => row.original.warehouse?.name || '-',
    },
    {
        accessorKey: 'manufacturer',
        header: 'Pembuat',
        cell: ({ row }) => row.original.manufacturer || '-',
    },
    {
        accessorKey: 'caliber',
        header: 'Kaliber',
        cell: ({ row }) => row.original.caliber || '-',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell key={row.original.id} row={row} />,
    },
];
