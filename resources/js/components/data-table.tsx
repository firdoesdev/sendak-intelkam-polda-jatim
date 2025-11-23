import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table'
import { Link } from "@inertiajs/react";

interface DataTableProps<T> {
    prev_page_url: string | null;
    next_page_url: string | null;
    columns: ColumnDef<T>[];
    data: T[];
    title:string
    onSearch: (search: string) => void;
}

const DataTable = <T,>(props: DataTableProps<T>) => {
    const table = useReactTable({
        data: props.data,
        columns: props.columns,
        getCoreRowModel: getCoreRowModel()
    });
    return (
        <div className="w-full">
            <div>
                <h2 className="text-2xl font-bold mb-4">{props.title}</h2>
            </div>
            <div className="mb-4 flex justify-end">

                <Input placeholder="Search" className="max-w-1/4" onChange={(e)=>props.onSearch(e.target.value)}/>
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={props.columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                >
                    <Link href={props.prev_page_url || '#'}>
                        Previous
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                >
                    <Link href={props.next_page_url || '#'}>
                        Next
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default DataTable;