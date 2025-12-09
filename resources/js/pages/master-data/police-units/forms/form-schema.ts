import { z } from 'zod';
    
export const policeUnitSchema = z
    .object({
        id: z.number().optional(),
        code: z.string().min(1, 'Silakan masukkan kode'),
        name: z.string().min(1, 'Silakan masukkan nama'),
        unit_type: z.string().min(1, 'Silakan masukkan tipe unit'),
        address: z.string().min(1, 'Silakan masukkan alamat'),
        region: z.string().min(1, 'Silakan masukkan region'),
        parent_id: z.number().nullable(),
        is_active: z.boolean().default(true),
    });