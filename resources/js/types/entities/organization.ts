import { TTimestamps } from '../common';

export type TOrganization = {
    id: number;
    name: string;
    org_type: string | null;
    registration_no: string | null;
    tax_no: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    email: string | null;
} & TTimestamps;
