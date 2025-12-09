import type { TPoliceUnit } from "@/types/entities/police-unit";
export type { TPoliceUnit } from "@/types/entities/police-unit";
import { Row } from "@tanstack/react-table";


export type TDialogProps = {
    row: Row<TPoliceUnit>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumPoliceUnitType {
    POLDA = 'POLDA',
    POLRES = 'POLRES',
    POLSEK = 'POLSEK',
}

export const PoliceUnitTypeOptions = [
    { label: 'Polda', value: EnumPoliceUnitType.POLDA },
    { label: 'Polres', value: EnumPoliceUnitType.POLRES },
    { label: 'Polsek', value: EnumPoliceUnitType.POLSEK },
];