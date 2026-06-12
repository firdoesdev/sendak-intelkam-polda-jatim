import DataTable from '@/components/data-table';
import handakPermits from '@/routes/handak-permits';
import { PaginationMeta, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { CreateHandakPermitForm } from '../forms/create-form-dialog';
import { THandakPermit } from '../types';
import { columns } from './columns';

const HandakPermitDataTable = () => {
    const page = usePage<SharedData & { data: PaginationMeta<THandakPermit> }>();
    const canCreate = page.props.auth.abilities?.['create-handak-permits'];

    const handleSearch = (search: string) => {
        router.visit(handakPermits.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<THandakPermit>
            onSearch={handleSearch}
            title="Rekom Handak"
            columns={columns}
            data={page.props.data.data}
            topActions={canCreate ? [<CreateHandakPermitForm key="add-handak-permit" />] : []}
        />
    );
};

export default HandakPermitDataTable;
