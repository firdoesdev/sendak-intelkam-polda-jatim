import AppLayout from '@/layouts/app-layout';
import policeUnits from '@/routes/master-data/police-units';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PoliceUnitDataTable from './data-tables/table';


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
                <PoliceUnitDataTable/>
            </div>
        </AppLayout>
    );
};




export default PoliceUnitsPage;
