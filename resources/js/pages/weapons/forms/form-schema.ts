import { z } from 'zod';

export const weaponSchema = z.object({
    id: z.number().optional(),
    code: z.string().min(1, 'Silakan masukkan kode senjata'),
    name: z.string().min(1, 'Silakan masukkan nama senjata'),
    permit_type: z.string().min(1, 'Silakan pilih tipe izin'),
    weapon_type: z.string().optional().nullable(),
    serial_number: z.string().min(1, 'Silakan masukkan nomor seri'),
    manufacturer: z.string().optional().nullable(),
    caliber: z.string().optional().nullable(),
    acquisition_date: z.string().optional().nullable(),
    condition: z.string().min(1, 'Silakan pilih kondisi'),
    status: z.string().min(1, 'Silakan pilih status'),
    warehouse_id: z.number().min(1, 'Silakan pilih gudang'),
    notes: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
});

export type WeaponFormData = z.infer<typeof weaponSchema>;
