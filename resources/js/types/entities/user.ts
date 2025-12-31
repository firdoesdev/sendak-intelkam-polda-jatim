import { TTimestamps } from "../common";
import { TDivision } from "./division";
import { TPoliceUnit } from "./police-unit";

export type TRole = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot?: {
        user_id: number;
        role_id: number;
    };
};

export type TUser = {
    id: number;
    name: string;
    email: string;
    roles?: TRole[];
    police_unit_id?: number | null;
    police_unit?: TPoliceUnit | null;
    default_division_id?: number | null;
    default_division?: TDivision | null;
} & TTimestamps;