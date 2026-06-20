import AppLayout from '@/layouts/app-layout';
import policeUnits from '@/routes/master-data/police-units';
import { BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import PoliceUnitDataTable from './data-tables/table';
import LoadingFallback from '@/components/loading-page';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Police Units',
        href: policeUnits.index().url,
    },
];

const PoliceUnitsPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Kepolisian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Deferred data='data' fallback={<LoadingFallback />}>
                <PoliceUnitDataTable/>
                </Deferred>
            </div>
        </AppLayout>
    );
};




export default PoliceUnitsPage;
