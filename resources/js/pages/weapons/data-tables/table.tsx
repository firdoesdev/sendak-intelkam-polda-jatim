import DataTable from '@/components/data-table';
import weapons from '@/routes/weapons';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TWeapon } from '../types';
import { CreateWeaponForm } from '../forms/create-form-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const WeaponDataTable = () => {
    const page = usePage<{
        data: PaginationMeta<TWeapon>;
        warehouses: Array<{ id: number; name: string; code: string }>;
        permitTypes: Array<{ value: string; label: string }>;
        statuses: Array<{ value: string; label: string; variant: string }>;
        conditions: Array<{ value: string; label: string; variant: string }>;
    }>();

    const { warehouses, permitTypes, statuses, conditions } = page.props;
    const queryParams = new URLSearchParams(window.location.search);

    const handleSearch = (search: string) => {
        router.visit(weapons.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const params: Record<string, string> = {};
        if (value) params[key] = value;

        router.visit(weapons.index({ mergeQuery: params }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    const filterComponents = (
        <div className="flex gap-2">
            <Select
                value={queryParams.get('warehouse_id') || ''}
                onValueChange={(value) => handleFilterChange('warehouse_id', value)}
            >
                <SelectTrigger id="warehouse-filter">
                    <SelectValue placeholder="Semua Gudang" />
                </SelectTrigger>
                <SelectContent>
                    {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                            {warehouse.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={queryParams.get('permit_type') || ''}
                onValueChange={(value) => handleFilterChange('permit_type', value)}
            >
                <SelectTrigger id="permit-type-filter">
                    <SelectValue placeholder="Semua Tipe" />
                </SelectTrigger>
                <SelectContent>

                    {permitTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                            {type.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={queryParams.get('status') || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
            >
                <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>

                    {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                            {status.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={queryParams.get('condition') || ''}
                onValueChange={(value) => handleFilterChange('condition', value)}
            >
                <SelectTrigger id="condition-filter">
                    <SelectValue placeholder="Semua Kondisi" />
                </SelectTrigger>
                <SelectContent>

                    {conditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <DataTable<TWeapon>
            onSearch={handleSearch}
            title="Data Senjata"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreateWeaponForm key="add-weapon" />]}
            filters={[filterComponents]}
        />
    );
};

export default WeaponDataTable;
