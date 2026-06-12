import LoadingFallback from '@/components/loading-page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import handakStock from '@/routes/handak-stock';
import { BreadcrumbItem } from '@/types';
import { TStockBalance } from '@/types/entities/handak';
import { Deferred, Head, usePage } from '@inertiajs/react';
import HandakStockHistoryTable from './history-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stok Bahan Peledak',
        href: handakStock.index().url,
    },
];

const HandakStockPage = () => {
    const { balances } = usePage<{ balances: TStockBalance[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stok Bahan Peledak" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Saldo Stok per Perusahaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Perusahaan</TableHead>
                                    <TableHead>Jenis Bahan</TableHead>
                                    <TableHead className="text-right">Saldo</TableHead>
                                    <TableHead>Satuan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {balances.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-muted-foreground text-center">
                                            Belum ada stok tercatat.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {balances.map((balance) => (
                                    <TableRow key={`${balance.organization_id}-${balance.material_type}-${balance.unit}`}>
                                        <TableCell>{balance.organization_name}</TableCell>
                                        <TableCell>{balance.material_type}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {Number(balance.balance).toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{balance.unit}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Deferred data="data" fallback={<LoadingFallback />}>
                    <HandakStockHistoryTable />
                </Deferred>
            </div>
        </AppLayout>
    );
};

export default HandakStockPage;
