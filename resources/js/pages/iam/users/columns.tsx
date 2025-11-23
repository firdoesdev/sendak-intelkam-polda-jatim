import { ColumnDef } from "@tanstack/react-table"
import {TUser} from './types'
 
export const columns: ColumnDef<TUser>[] = [
{
    accessorKey: "id",
    header: "ID",
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