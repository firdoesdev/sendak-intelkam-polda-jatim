import { ColumnDef } from '@tanstack/react-table';
import { TPermission } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { EditPermissionFormDialog } from './forms/edit-form-dialog';
import { DeletePermissionDialog } from './dialogs/delete-dialog';

export const columns: ColumnDef<TPermission>[] = [
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
        accessorKey: 'guard_name',
        header: 'Guard Name',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const permission = row.original;
            return (
                <div className="flex items-center gap-2">
                    <EditPermissionFormDialog permission={permission} />
                    <DeletePermissionDialog permission={permission} />
                </div>
            );
        },
    },
];
