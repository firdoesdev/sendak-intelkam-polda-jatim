import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginationMeta } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { TPermission } from './types';
import { columns } from './columns';
import DataTable from '@/components/data-table';
import { CreatePermissionFormDialog } from './forms/create-form-dialog';
import PermissionController from '@/actions/App/Http/Controllers/IAM/PermissionController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: PermissionController.index().url,
    },
];

const PermissionPage = () => {
    const page = usePage<{ data: PaginationMeta<TPermission> }>();

    const handleSearch = (search: string) => {
        router.visit(PermissionController.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable<TPermission>
                    onSearch={handleSearch}
                    onSelectedRows={(rows) => console.log(rows)}
                    title="Data Permission"
                    columns={columns}
                    data={page.props.data.data}
                    actionButtons={<CreatePermissionFormDialog />}
                />
            </div>
        </AppLayout>
    );
};

export default PermissionPage;
