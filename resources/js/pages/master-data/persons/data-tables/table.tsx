import DataTable from '@/components/data-table';
import persons from '@/routes/master-data/persons';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TPerson } from '../types';
import { CreatePersonForm } from '../forms/create-form-dialog';

const PersonDataTable = () => {
    const page = usePage<{ data: PaginationMeta<TPerson> }>();

    const handleSearch = (search: string) => {
        router.visit(persons.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<TPerson>
            onSearch={handleSearch}
            title="Data Person"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreatePersonForm key="add-person" />]}
        />
    );
};

export default PersonDataTable;
