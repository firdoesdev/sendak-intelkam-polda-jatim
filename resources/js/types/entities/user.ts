import { TTimestamps } from "../common";
import { TDivision } from "./division";
import { TPoliceUnit } from "./police-unit";

export type TUser = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    police_unit_id?: number | null;
    police_unit?: TPoliceUnit | null;
    default_division_id?: number | null;
    default_division?: TDivision | null;
} & TTimestamps;