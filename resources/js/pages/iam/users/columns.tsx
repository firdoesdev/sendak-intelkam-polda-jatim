import { ColumnDef } from "@tanstack/react-table"
import {TUser} from './types'
import { Checkbox } from "@/components/ui/checkbox"
 
export const columns: ColumnDef<TUser>[] = [
{
    accessorKey: "id",
    header: "ID",
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
]