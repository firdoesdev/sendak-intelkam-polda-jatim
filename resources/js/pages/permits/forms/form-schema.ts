import { z } from 'zod';

export const permitSchema = z.object({
    id: z.number().optional(),
    division_id: z.number({
        required_error: 'Silakan pilih divisi',
    }),
    applicant_id: z.number({
        required_error: 'Silakan pilih pemohon',
    }),
    permit_type: z.enum(['SENPI', 'POLSUS', 'HANDAK', 'SPORT'], {
        required_error: 'Silakan pilih tipe izin',
    }),
    status: z.enum(['draft', 'pending', 'approved', 'rejected', 'expired', 'cancelled']).optional(),
    valid_from: z.string().nullable().optional(),
    valid_to: z.string().nullable().optional(),
});
