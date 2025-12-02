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

import { useReactTable, getCoreRowModel, flexRender, ColumnDef, getFilteredRowModel } from '@tanstack/react-table'
import { Link, usePage } from "@inertiajs/react";
import { PaginationMeta } from "@/types";
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { useState, useEffect, Activity, useEffectEvent } from "react";
import clsx from "clsx";

interface DataTableProps<T> {

    columns: ColumnDef<T>[];
    data: T[];
    title: string
    onSearch?: (search: string) => void;
    onSelectedRows?: (rows: T[]) => void;
    topActions?: React.ReactNode[];
}

const DataTable = <T,>(props: DataTableProps<T>) => {
    const page = usePage<{ data: PaginationMeta<T> }>()

    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data: props.data,
        columns: props.columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection, // set row selection `checked` or `unchecked`
        getFilteredRowModel: getFilteredRowModel(), // get row selection data
        state: {
            rowSelection // state selected row
        }
    });

    const selectedRow = useEffectEvent((onSelectedRows?: (rows: T[]) => void) => {
        onSelectedRows?.(table.getFilteredSelectedRowModel().rows.map((row) => row.original));
    })
    
    useEffect(() => {
        selectedRow(props.onSelectedRows);
    }, [props.onSelectedRows, rowSelection]);

    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-4">{props.title}</h2>
                <div className="space-x-2">
                    {props.topActions}
                </div>
            </div>
            <div className="mb-4 flex justify-start">
                <Activity mode={props.onSearch ? "visible" : "hidden"}>
                    <Input placeholder="Search" className="w-full lg:max-w-1/4" onChange={(e) => props.onSearch?.(e.target.value)} />
                </Activity>
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
                                    <TableCell key={cell.id} className="p-3">
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
            <div className={clsx({
                'flex items-center mt-4': true,
                'justify-between': table.getFilteredSelectedRowModel().rows.length > 0,
                'justify-end': table.getFilteredSelectedRowModel().rows.length === 0,
            })}>
                <Activity mode={table.getFilteredSelectedRowModel().rows.length > 0 ? "visible" : "hidden"}>
                    <div className="text-muted-foreground flex-1 text-sm">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                </Activity>
                <div className="flex items-center space-x-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                    >
                        <Link href={page.props.data.first_page_url || '#'}>
                            <ChevronsLeft />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                    >
                        <Link href={page.props.data.prev_page_url || '#'}>
                            <ChevronLeft />
                        </Link>
                    </Button>
                    <div className="text-sm">
                        {page.props.data.current_page} of {page.props.data.last_page}
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                    >
                        <Link href={page.props.data.next_page_url || '#'}>
                            <ChevronRight />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                    >
                        <Link href={page.props.data.last_page_url || '#'}>
                            <ChevronsRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DataTable;