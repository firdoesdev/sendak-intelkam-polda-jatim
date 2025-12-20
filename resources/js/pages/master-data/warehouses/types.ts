import type { TWarehouse } from "@/types/entities/warehouse";
export type { TWarehouse } from "@/types/entities/warehouse";
import { Row } from "@tanstack/react-table";


export type TDialogProps = {
    row: Row<TWarehouse>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumWarehouseStorageType {
    POLICE_UNIT = 'POLICE_UNIT',
    HANDAK_WAREHOUSE = 'HANDAK_WAREHOUSE',
    PERBAKIN = 'PERBAKIN',
}

export const WarehouseStorageTypeOptions = [
    { label: 'Police Unit', value: EnumWarehouseStorageType.POLICE_UNIT },
    { label: 'Handak Warehouse', value: EnumWarehouseStorageType.HANDAK_WAREHOUSE },
    { label: 'Perbakin', value: EnumWarehouseStorageType.PERBAKIN },
];
