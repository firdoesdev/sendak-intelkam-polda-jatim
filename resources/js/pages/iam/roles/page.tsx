import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TRole } from './types';
import { usePage, router } from '@inertiajs/react';
import { PaginationMeta } from "@/types";
import { columns } from './columns';
import DataTable from '@/components/data-table';
import RoleController from '@/actions/App/Http/Controllers/IAM/RoleController';
import { CreateRoleFormDialog } from './forms/create-form-dialog';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: RoleController.index().url,
    },
];

const RolePage = () => {
    const page = usePage<{ data: PaginationMeta<TRole> }>();

    const handleSearch = (search: string) => {
        router.visit(RoleController.index({ mergeQuery: { search: search } }), { preserveState: true, replace: true, only: ['data'] });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable<TRole>
                    onSearch={handleSearch}
                    onSelectedRows={(rows) => console.log(rows)}
                    title="Data Role"
                    columns={columns}
                    data={page.props.data.data}
                    topActions={[<CreateRoleFormDialog />]}
                />
            </div>
        </AppLayout>
    )
};

export default RolePage;