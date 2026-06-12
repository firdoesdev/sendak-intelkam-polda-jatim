import LoadingFallback from '@/components/loading-page';
import AppLayout from '@/layouts/app-layout';
import handakPermits from '@/routes/handak-permits';
import { BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import HandakPermitDataTable from './data-tables/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rekom Handak',
        href: handakPermits.index().url,
    },
];

const HandakPermitsPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekom Handak" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Deferred data="data" fallback={<LoadingFallback />}>
                    <HandakPermitDataTable />
                </Deferred>
            </div>
        </AppLayout>
    );
};

export default HandakPermitsPage;
