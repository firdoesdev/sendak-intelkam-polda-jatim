import { TTimestamps } from '../common';

export type TPerson = {
    id: number;
    national_id: string | null;
    full_name: string;
    birth_date: string | null;
    gender: 'male' | 'female' | 'unknown';
    job_title: string | null;
    rank: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    police_unit_id: number | null;
    organization_id: number | null;
    photo_path: string | null;
    police_unit?: {
        id: number;
        name: string;
        code: string;
    } | null;
    organization?: {
        id: number;
        name: string;
    } | null;
} & TTimestamps;
