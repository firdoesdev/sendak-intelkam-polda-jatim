import DataTable from '@/components/data-table';
import policeUnits from '@/routes/master-data/police-units';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TPoliceUnit } from '../types';
import { CreatePoliceUnitForm } from '../forms/create-form-dialog';

const PoliceUnitDataTable = () => {
    const page = usePage<{ data: PaginationMeta<TPoliceUnit> }>();

    const handleSearch = (search: string) => {
        router.get(policeUnits.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<TPoliceUnit>
            onSearch={handleSearch}
            title="Data Kepolisian"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreatePoliceUnitForm key="add-police-unit" />]}
        />
    );
};

export default PoliceUnitDataTable;
