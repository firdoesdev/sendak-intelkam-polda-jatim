import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { PaginationMeta } from '@/types';
import { TStockLedgerEntry } from '@/types/entities/handak';
import { usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

const entryTypeLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    purchase: { label: 'Pembelian', variant: 'default' },
    usage: { label: 'Pemakaian', variant: 'destructive' },
    leftover_usage: { label: 'Pemakaian Sisa', variant: 'destructive' },
    adjustment: { label: 'Penyesuaian', variant: 'secondary' },
};

const columns: ColumnDef<TStockLedgerEntry>[] = [
    {
        accessorKey: 'transaction_date',
        header: 'Tanggal',
        cell: ({ row }) => new Date(row.original.transaction_date).toLocaleDateString('id-ID'),
    },
    {
        accessorKey: 'organization',
        header: 'Perusahaan',
        cell: ({ row }) => row.original.organization?.name || '-',
    },
    {
        accessorKey: 'material_type',
        header: 'Jenis Bahan',
    },
    {
        accessorKey: 'entry_type',
        header: 'Jenis Transaksi',
        cell: ({ row }) => {
            const entry = entryTypeLabels[row.original.entry_type] ?? {
                label: row.original.entry_type,
                variant: 'outline' as const,
            };
            return <Badge variant={entry.variant}>{entry.label}</Badge>;
        },
    },
    {
        accessorKey: 'quantity',
        header: 'Jumlah',
        cell: ({ row }) => {
            const quantity = Number(row.original.quantity);
            return (
                <span className={`font-mono ${quantity < 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {quantity > 0 ? '+' : ''}
                    {quantity.toLocaleString('id-ID')} {row.original.unit}
                </span>
            );
        },
    },
    {
        accessorKey: 'permit',
        header: 'Rekom Terkait',
        cell: ({ row }) => {
            const permit = row.original.permit;
            if (!permit) return '-';
            return (
                <span className="font-mono text-sm">
                    {permit.si_number || permit.permit_number || `#${permit.id}`}
                </span>
            );
        },
    },
    {
        accessorKey: 'creator',
        header: 'Dicatat Oleh',
        cell: ({ row }) => row.original.creator?.name || '-',
    },
];

const HandakStockHistoryTable = () => {
    const page = usePage<{ data: PaginationMeta<TStockLedgerEntry> }>();

    return (
        <DataTable<TStockLedgerEntry>
            title="Riwayat Mutasi Stok"
            columns={columns}
            data={page.props.data.data}
        />
    );
};

export default HandakStockHistoryTable;
