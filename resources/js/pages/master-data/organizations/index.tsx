import AppLayout from '@/layouts/app-layout';
import organizations from '@/routes/master-data/organizations';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import OrganizationDataTable from './data-tables/table';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Organisasi',
        href: organizations.index().url,
    },
];

const OrganizationsPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Organisasi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <OrganizationDataTable/>
            </div>
        </AppLayout>
    );
};




export default OrganizationsPage;
