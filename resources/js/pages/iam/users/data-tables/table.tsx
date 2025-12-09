import DataTable from '@/components/data-table';
import users from '@/routes/iam/users';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TUser } from '../types';
import { CreateUserForm } from '../forms/create-form-dialog';

const UserDataTable = () => {
    const page = usePage<{ data: PaginationMeta<TUser> }>();

    const handleSearch = (search: string) => {
        router.visit(users.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<TUser>
            onSearch={handleSearch}
            title="Data User"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreateUserForm key="add-user" />]}
        />
    );
};

export default UserDataTable;
