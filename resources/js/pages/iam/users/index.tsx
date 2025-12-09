import AppLayout from '@/layouts/app-layout';
import users from '@/routes/iam/users';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import UserDataTable from './data-tables/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data User',
        href: users.index().url,
    },
];

const UserPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <UserDataTable />
            </div>
        </AppLayout>
    );
};

export default UserPage;
