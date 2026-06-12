import type { THandakPermit } from '@/types/entities/handak';
export type {
    TExplosiveMaterialType,
    TExplosivesMaterial,
    THandakPermit,
    THandakPermitReference,
    TStockBalance,
    TStockLedgerEntry,
} from '@/types/entities/handak';
import { Row } from '@tanstack/react-table';

export type TDialogProps = {
    row: Row<THandakPermit>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumRecommendationType {
    P1 = 'P1',
    P2 = 'P2',
    P3 = 'P3',
    IJIN_GUDANG = 'IJIN_GUDANG',
}

export const RecommendationTypeOptions = [
    { label: 'Ijin Gudang (Penyimpanan)', value: EnumRecommendationType.IJIN_GUDANG },
    { label: 'P3 (Penggunaan)', value: EnumRecommendationType.P3 },
    { label: 'P2 (Pembelian/Produksi)', value: EnumRecommendationType.P2 },
    { label: 'P1 (Penggunaan Sisa)', value: EnumRecommendationType.P1 },
];

export const ReferenceTypeOptions = [
    { label: 'Surat Permohonan Perusahaan', value: 'company_request' },
    { label: 'Surat Izin Induk', value: 'parent_si' },
    { label: 'Surat Izin Gudang', value: 'warehouse_si' },
    { label: 'Surat Dinas ESDM', value: 'esdm_letter' },
    { label: 'Rekomendasi Polres', value: 'polres_recommendation' },
    { label: 'Lainnya', value: 'other' },
];

export type THandakPageProps = {
    division: { id: number; code: string; name: string } | null;
    applicants: Array<{
        id: number;
        display_name: string;
        applicant_type: string;
        organization_id: number | null;
        organization?: { id: number; name: string } | null;
    }>;
    warehouses: Array<{
        id: number;
        code: string;
        name: string;
        address: string | null;
        village: string | null;
        city: string | null;
        province: string | null;
        capacity_kg: string | number | null;
        area_sqm: string | number | null;
    }>;
    materialTypes: Array<{ id: number; name: string; default_unit: string }>;
    parentOptions: Array<{
        id: number;
        permit_number: string | null;
        si_number: string | null;
        applicant_id: number;
        status: string;
        valid_from: string | null;
        valid_to: string | null;
        applicant?: { id: number; organization_id: number | null; display_name: string } | null;
    }>;
    stockBalances: Array<{
        organization_id: number;
        material_type: string;
        unit: string;
        balance: string | number;
    }>;
};
