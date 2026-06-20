import AppLayout from '@/layouts/app-layout';
import weapons from '@/routes/weapons';
import { BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import WeaponDataTable from './data-tables/table';
import LoadingFallback from '@/components/loading-page';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Senjata',
        href: weapons.index().url,
    },
];

const WeaponsPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Senjata" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Deferred data='data' fallback={<LoadingFallback />}>
                <WeaponDataTable />
                </Deferred>
            </div>
        </AppLayout>
    );
};

export default WeaponsPage;
