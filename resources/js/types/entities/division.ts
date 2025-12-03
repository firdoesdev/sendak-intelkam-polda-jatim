import { TTimestamps } from "../common";

export type TDivision = {
    id: number;
    code:string;
    name:string;
    description:string;
    is_active: boolean;
} & TTimestamps;
