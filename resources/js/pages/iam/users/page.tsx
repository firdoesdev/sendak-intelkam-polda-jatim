import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { index } from '@/routes/users';
import { Head } from '@inertiajs/react';
import UserDataTable from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: index().url,
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
    )
};

export default UserPage;