import AppLayout from '@/layouts/app-layout';
import organizations from '@/routes/master-data/organizations';
import { BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import OrganizationDataTable from './data-tables/table';
import LoadingFallback from '@/components/loading-page';


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
                <Deferred data='data' fallback={<LoadingFallback />}>
                <OrganizationDataTable/>
                </Deferred>
            </div>
        </AppLayout>
    );
};




export default OrganizationsPage;
