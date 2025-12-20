import AppLayout from '@/layouts/app-layout';
import applicants from '@/routes/master-data/applicants';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ApplicantDataTable from './data-tables/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Pemohon',
        href: applicants.index().url,
    },
];

const ApplicantsPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pemohon" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <ApplicantDataTable />
            </div>
        </AppLayout>
    );
};

export default ApplicantsPage;
