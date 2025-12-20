import { TTimestamps } from '../common';
import { TPoliceUnit } from './police-unit';
import { TOrganization } from './organization';

export type TWarehouse = {
    id: number;
    code: string;
    name: string;
    storage_type: string;
    police_unit_id: number;
    organization_id: number | null;
    address: string;
    city: string;
    province: string;
    is_active: boolean;
    police_unit?: TPoliceUnit;
    organization?: TOrganization;
} & TTimestamps;
