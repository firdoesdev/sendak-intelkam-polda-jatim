import { z } from 'zod';

export const personSchema = z.object({
    national_id: z.string().nullable().optional(),
    full_name: z.string().min(1, 'Nama lengkap wajib diisi'),
    birth_date: z.string().nullable().optional(),
    gender: z.enum(['male', 'female', 'unknown']),
    job_title: z.string().nullable().optional(),
    rank: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    police_unit_id: z.number().nullable().optional(),
    organization_id: z.number().nullable().optional(),
    photo: z.instanceof(File).nullable().optional(),
});
