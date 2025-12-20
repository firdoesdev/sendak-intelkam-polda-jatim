import AppLayout from '@/layouts/app-layout';
import permits from '@/routes/permits';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PermitDataTable from './data-tables/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Izin',
        href: permits.index().url,
    },
];

const PermitsPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Izin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <PermitDataTable />
            </div>
        </AppLayout>
    );
};

export default PermitsPage;
