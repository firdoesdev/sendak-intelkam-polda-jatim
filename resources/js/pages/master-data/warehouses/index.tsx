import AppLayout from '@/layouts/app-layout';
import warehouses from '@/routes/master-data/warehouses';
import { BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import WarehouseDataTable from './data-tables/table';
import LoadingFallback from '@/components/loading-page';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Warehouses',
        href: warehouses.index().url,
    },
];

const WarehousesPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Gudang" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Deferred data='data' fallback={<LoadingFallback />}>
                <WarehouseDataTable/>
                </Deferred>
            </div>
        </AppLayout>
    );
};




export default WarehousesPage;
