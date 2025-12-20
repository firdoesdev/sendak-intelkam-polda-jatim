import DataTable from '@/components/data-table';
import warehouses from '@/routes/master-data/warehouses';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TWarehouse } from '../types';
import { CreateWarehouseForm } from '../forms/create-form-dialog';

const WarehouseDataTable = () => {
    const page = usePage<{ data: PaginationMeta<TWarehouse> }>();

    const handleSearch = (search: string) => {
        router.visit(warehouses.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<TWarehouse>
            onSearch={handleSearch}
            title="Data Gudang"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreateWarehouseForm key="add-warehouse" />]}
        />
    );
};

export default WarehouseDataTable;
