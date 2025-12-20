import DataTable from '@/components/data-table';
import permits from '@/routes/permits';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TPermit } from '../types';
import { CreatePermitForm } from '../forms/create-form-dialog';

const PermitDataTable = () => {
    const page = usePage<{ data: PaginationMeta<TPermit> }>();

    const handleSearch = (search: string) => {
        router.visit(permits.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<TPermit>
            onSearch={handleSearch}
            title="Data Izin"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreatePermitForm key="add-permit" />]}
        />
    );
};

export default PermitDataTable;
