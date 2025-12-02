import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { index } from '@/routes/users';
import { Head } from '@inertiajs/react';
import { TUser } from './types';
import { usePage, router } from '@inertiajs/react';
import { PaginationMeta } from "@/types";
import { columns } from './columns'
import DataTable from '@/components/data-table';
import UserController from '@/actions/App/Http/Controllers/IAM/UserController'
import { Button } from '@/components/ui/button';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: index().url,
    },
];

const UserPage = () => {
    const page = usePage<{ data: PaginationMeta<TUser> }>();

    const handleSearch = (search: string) => {
        router.visit(UserController.index({ mergeQuery: { search: search } }), { preserveState: true, replace: true, only: ['data'] });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable<TUser>
                    onSearch={handleSearch}
                    onSelectedRows={(rows) => console.log(rows)}
                    title="Data User"
                    columns={columns}
                    data={page.props.data.data}
                    topActions={[
                        <Button key="add-user" type='button' variant='default'>Tambah User</Button>
                    ]}
                />
            </div>
        </AppLayout>
    )
};

export default UserPage;