import { TTimestamps } from '../common';
import { TPermit } from './permit';

export type TPermitRenewal = {
    id: number;
    renewal_number: string | null;
    permit_id: number;
    current_valid_to: string;
    new_valid_to: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    reason: string | null;
    requested_by: number;
    submitted_at: string | null;
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
    permit?: TPermit;
    requester?: any; // TODO: Add TUser type
    approver?: any; // TODO: Add TUser type
} & TTimestamps;
