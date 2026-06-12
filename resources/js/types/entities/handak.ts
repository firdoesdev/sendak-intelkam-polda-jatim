import { TTimestamps } from '../common';
import { TPermit } from './permit';

export type TExplosivesMaterial = {
    id: number;
    permit_id: number;
    material_type: string;
    item_name: string;
    weight: string | number;
    quantity: number;
    unit: string;
    notes: string | null;
} & TTimestamps;

export type THandakPermitReference = {
    id: number;
    permit_id: number;
    reference_type: string;
    document_number: string;
    document_date: string | null;
    issuer: string | null;
    notes: string | null;
} & TTimestamps;

export type THandakPermit = TPermit & {
    si_number: string | null;
    parent_permit_id: number | null;
    warehouse_id: number | null;
    recommendation_type: 'P1' | 'P2' | 'P3' | 'IJIN_GUDANG' | null;
    activity_type: string | null;
    representative_name: string | null;
    representative_title: string | null;
    representative_nationality: string | null;
    purpose: string | null;
    activity_location: string | null;
    parent_permit?: {
        id: number;
        permit_number: string | null;
        si_number: string | null;
        recommendation_type: string | null;
    } | null;
    warehouse?: {
        id: number;
        code: string;
        name: string;
        address: string | null;
        village: string | null;
        city: string | null;
        province: string | null;
        capacity_kg: string | number | null;
        area_sqm: string | number | null;
    } | null;
    explosives_materials?: TExplosivesMaterial[];
    handak_references?: THandakPermitReference[];
};

export type TExplosiveMaterialType = {
    id: number;
    name: string;
    default_unit: string;
};

export type TStockBalance = {
    organization_id: number;
    organization_name?: string;
    material_type: string;
    unit: string;
    balance: string | number;
};

export type TStockLedgerEntry = {
    id: number;
    organization_id: number;
    permit_id: number | null;
    material_type: string;
    unit: string;
    entry_type: 'purchase' | 'usage' | 'leftover_usage' | 'adjustment';
    quantity: string | number;
    transaction_date: string;
    notes: string | null;
    organization?: { id: number; name: string } | null;
    permit?: {
        id: number;
        permit_number: string | null;
        si_number: string | null;
        recommendation_type: string | null;
    } | null;
    creator?: { id: number; name: string } | null;
} & TTimestamps;
