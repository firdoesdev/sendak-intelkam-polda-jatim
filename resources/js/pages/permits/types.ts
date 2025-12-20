import type { TPermit } from "@/types/entities/permit";
export type { TPermit } from "@/types/entities/permit";
import { Row } from "@tanstack/react-table";

export type TDialogProps = {
    row: Row<TPermit>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumPermitType {
    SENPI = 'SENPI',
    POLSUS = 'POLSUS',
    HANDAK = 'HANDAK',
    SPORT = 'SPORT',
}

export const PermitTypeOptions = [
    { label: 'Senjata Api', value: EnumPermitType.SENPI },
    { label: 'Kepolisian Khusus', value: EnumPermitType.POLSUS },
    { label: 'Perlengkapan dan Peralatan', value: EnumPermitType.HANDAK },
    { label: 'Olahraga', value: EnumPermitType.SPORT },
];

export enum EnumPermitStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}

export const PermitStatusOptions = [
    { label: 'Draft', value: EnumPermitStatus.DRAFT, variant: 'secondary' },
    { label: 'Menunggu Persetujuan', value: EnumPermitStatus.PENDING, variant: 'warning' },
    { label: 'Disetujui', value: EnumPermitStatus.APPROVED, variant: 'success' },
    { label: 'Ditolak', value: EnumPermitStatus.REJECTED, variant: 'destructive' },
    { label: 'Kadaluarsa', value: EnumPermitStatus.EXPIRED, variant: 'outline' },
    { label: 'Dibatalkan', value: EnumPermitStatus.CANCELLED, variant: 'outline' },
];
