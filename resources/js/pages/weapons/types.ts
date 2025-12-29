import type { TWeapon } from "@/types/entities/weapon";
export type { TWeapon } from "@/types/entities/weapon";
import { Row } from "@tanstack/react-table";

export type TDialogProps = {
    row: Row<TWeapon>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumWeaponStatus {
    AVAILABLE = 'available',
    ISSUED = 'issued',
    MAINTENANCE = 'maintenance',
    DECOMMISSIONED = 'decommissioned',
}

export enum EnumWeaponCondition {
    NEW = 'new',
    EXCELLENT = 'excellent',
    GOOD = 'good',
    FAIR = 'fair',
    POOR = 'poor',
    DAMAGED = 'damaged',
}

export enum EnumPermitType {
    SENPI = 'SENPI',
    POLSUS = 'POLSUS',
    HANDAK = 'HANDAK',
    SPORT = 'SPORT',
}

export const WeaponStatusOptions = [
    { label: 'Tersedia', value: EnumWeaponStatus.AVAILABLE },
    { label: 'Dipinjamkan', value: EnumWeaponStatus.ISSUED },
    { label: 'Maintenance', value: EnumWeaponStatus.MAINTENANCE },
    { label: 'Tidak Aktif', value: EnumWeaponStatus.DECOMMISSIONED },
];

export const WeaponConditionOptions = [
    { label: 'Baru', value: EnumWeaponCondition.NEW },
    { label: 'Sangat Baik', value: EnumWeaponCondition.EXCELLENT },
    { label: 'Baik', value: EnumWeaponCondition.GOOD },
    { label: 'Cukup', value: EnumWeaponCondition.FAIR },
    { label: 'Kurang', value: EnumWeaponCondition.POOR },
    { label: 'Rusak', value: EnumWeaponCondition.DAMAGED },
];

export const PermitTypeOptions = [
    { label: 'Senjata Api', value: EnumPermitType.SENPI },
    { label: 'Kepolisian Khusus', value: EnumPermitType.POLSUS },
    { label: 'Perlengkapan dan Peralatan', value: EnumPermitType.HANDAK },
    { label: 'Olahraga', value: EnumPermitType.SPORT },
];
