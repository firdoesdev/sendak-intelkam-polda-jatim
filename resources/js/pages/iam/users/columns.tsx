import { ColumnDef } from "@tanstack/react-table"
import {TUser} from './types'
import { Checkbox } from "@/components/ui/checkbox"
import {DropdownMenu, DropdownMenuTrigger,DropdownMenuItem, DropdownMenuLabel, DropdownMenuContent, DropdownMenuSeparator} from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
 
export const columns: ColumnDef<TUser>[] = [
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
  },
  {
    accessorKey: "email",
    header: "Email",
    
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]