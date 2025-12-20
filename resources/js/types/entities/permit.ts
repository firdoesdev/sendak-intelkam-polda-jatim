import { TTimestamps } from '../common';

export type TPermit = {
    id: number;
    permit_number: string | null;
    division_id: number;
    applicant_id: number;
    permit_type: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
    submitted_at: string | null;
    approved_at: string | null;
    valid_from: string | null;
    valid_to: string | null;
    created_by: number | null;
    updated_by: number | null;
    division?: {
        id: number;
        code: string;
        name: string;
    } | null;
    applicant?: {
        id: number;
        display_name: string;
        applicant_type: string;
        person?: {
            id: number;
            full_name: string;
        } | null;
        organization?: {
            id: number;
            name: string;
        } | null;
    } | null;
    creator?: {
        id: number;
        name: string;
    } | null;
    updater?: {
        id: number;
        name: string;
    } | null;
} & TTimestamps;
