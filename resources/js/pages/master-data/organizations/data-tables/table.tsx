import DataTable from '@/components/data-table';
import organizations from '@/routes/master-data/organizations';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TOrganization } from '../types';
import { CreateOrganizationForm } from '../forms/create-form-dialog';

const OrganizationDataTable = () => {
    const page = usePage<{ data: PaginationMeta<TOrganization> }>();

    const handleSearch = (search: string) => {
        router.visit(organizations.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<TOrganization>
            onSearch={handleSearch}
            title="Data Organisasi"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreateOrganizationForm key="add-organization" />]}
        />
    );
};

export default OrganizationDataTable;
