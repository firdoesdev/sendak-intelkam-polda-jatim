import { z } from 'zod';
    
export const warehouseSchema = z
    .object({
        id: z.number().optional(),
        code: z.string().min(1, 'Silakan masukkan kode'),
        name: z.string().min(1, 'Silakan masukkan nama'),
        storage_type: z.string().min(1, 'Silakan pilih tipe penyimpanan'),
        police_unit_id: z.number().min(1, 'Silakan pilih satuan kepolisian'),
        organization_id: z.number().nullable().optional(),
        address: z.string().min(1, 'Silakan masukkan alamat'),
        city: z.string().min(1, 'Silakan masukkan kota'),
        province: z.string().min(1, 'Silakan masukkan provinsi'),
        is_active: z.boolean().default(true),
    });
