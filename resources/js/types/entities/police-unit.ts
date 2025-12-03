import { TTimestamps } from '../common';

export type TPoliceUnit = {
    id: number;
    code:string;
    name:string;
    unit_type:string;
    region:string;
    address: string | null;
    parent_id: number | null;
    is_active: boolean;
} & TTimestamps;
