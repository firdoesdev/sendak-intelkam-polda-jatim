import { z } from 'zod';
    
export const organizationSchema = z
    .object({
        id: z.number().optional(),
        name: z.string().min(1, 'Silakan masukkan nama'),
        org_type: z.string().min(1, 'Silakan masukkan tipe organisasi'),
        registration_no: z.string().nullable(),
        tax_no: z.string().nullable(),
        address: z.string().nullable(),
        city: z.string().nullable(),
        province: z.string().nullable(),
        email: z.string().email('Email tidak valid').nullable().or(z.literal('')),
    });
