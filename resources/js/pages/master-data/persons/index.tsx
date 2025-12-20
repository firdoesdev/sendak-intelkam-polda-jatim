import AppLayout from '@/layouts/app-layout';
import persons from '@/routes/master-data/persons';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PersonDataTable from './data-tables/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Person',
        href: persons.index().url,
    },
];

const PersonsPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Person" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <PersonDataTable />
            </div>
        </AppLayout>
    );
};

export default PersonsPage;
