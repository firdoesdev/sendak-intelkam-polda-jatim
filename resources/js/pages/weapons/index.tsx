import AppLayout from '@/layouts/app-layout';
import weapons from '@/routes/weapons';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import WeaponDataTable from './data-tables/table';

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
                <WeaponDataTable />
            </div>
        </AppLayout>
    );
};

export default WeaponsPage;
