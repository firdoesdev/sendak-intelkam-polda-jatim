import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { columns, User } from './columns'
import { usePage } from '@inertiajs/react'
import { PaginationMeta } from "@/types";
import { Button } from "@/components/ui/button";

export default function UserDataTable() {
    const props = usePage<{ users: PaginationMeta<User> }>().props;

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            columns.map((column) => (
                                <TableHead key={column.accessorKey as string}>
                                    {column.header}
                                </TableHead>
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {props.users.data.map((user) => (
                        <TableRow key={user.id}>
                            {
                                columns.map((column) => (
                                    <TableCell key={column.accessorKey}>
                                        {user[column.accessorKey as keyof User]}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => props.users.prev_page_url}
                    disabled={!props.users.prev_page_url}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => props.users.next_page_url}
                    disabled={!props.users.next_page_url}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}