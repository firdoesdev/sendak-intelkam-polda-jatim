import { TTimestamps } from '../common';

export type TApplicant = {
    id: number;
    applicant_type: 'person' | 'organization';
    person_id: number | null;
    organization_id: number | null;
    display_name: string;
    person?: {
        id: number;
        full_name: string;
        national_id: string | null;
    } | null;
    organization?: {
        id: number;
        name: string;
        org_type: string | null;
    } | null;
} & TTimestamps;
