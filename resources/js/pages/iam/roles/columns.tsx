import { ColumnDef } from "@tanstack/react-table"
import {TRole} from './types'
import { Checkbox } from "@/components/ui/checkbox"
import { EditRoleFormDialog } from './forms/edit-form-dialog'
import { DeleteRoleDialog } from './dialogs/delete-dialog'
import { Link } from '@inertiajs/react'
import RoleController from '@/actions/App/Http/Controllers/IAM/RoleController'
 
export const columns: ColumnDef<TRole>[] = [
{
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({row}) =>(
      <Checkbox 
        checked={row.getIsSelected()} 
        onCheckedChange={(value)=> row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <Link 
          href={RoleController.show({ role: role.id }).url} 
          className="font-medium text-primary hover:underline"
        >
          {role.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "guard_name",
    header: "Guard Name",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditRoleFormDialog role={role} />
          <DeleteRoleDialog role={role} />
        </div>
      )
    },
  }
]