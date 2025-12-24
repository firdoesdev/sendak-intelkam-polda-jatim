import { TTimestamps } from '../common';
import { TWarehouse } from './warehouse';
import { TPermit } from './permit';

export type TWeapon = {
    id: number;
    code: string;
    name: string;
    permit_type: 'SENPI' | 'POLSUS' | 'HANDAK' | 'SPORT';
    weapon_type: string | null;
    serial_number: string;
    manufacturer: string | null;
    caliber: string | null;
    acquisition_date: string | null;
    condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
    status: 'available' | 'issued' | 'maintenance' | 'decommissioned';
    warehouse_id: number;
    notes: string | null;
    is_active: boolean;
    warehouse?: TWarehouse;
    current_permit?: TPermit;
} & TTimestamps;

export type TWeaponMovement = {
    id: number;
    weapon_id: number;
    movement_type: 'check_in' | 'check_out' | 'transfer' | 'maintenance' | 'return_from_maintenance' | 'disposal';
    from_warehouse_id: number | null;
    to_warehouse_id: number | null;
    permit_id: number | null;
    person_id: number | null;
    moved_by: number;
    moved_at: string;
    notes: string | null;
    weapon?: TWeapon;
    from_warehouse?: TWarehouse;
    to_warehouse?: TWarehouse;
    permit?: TPermit;
} & TTimestamps;

export type TWeaponTransferRequest = {
    id: number;
    request_number: string | null;
    weapon_id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    reason: string | null;
    requested_by: number;
    submitted_at: string | null;
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
    weapon?: TWeapon;
    from_warehouse?: TWarehouse;
    to_warehouse?: TWarehouse;
    requester?: any; // TODO: Add TUser type
    approver?: any; // TODO: Add TUser type
} & TTimestamps;
