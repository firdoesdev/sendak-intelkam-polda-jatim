import { z } from 'zod';

export const applicantSchema = z
    .object({
        id: z.number().optional(),
        applicant_type: z.enum(['person', 'organization'], {
            required_error: 'Silakan pilih tipe pemohon',
        }),
        person_id: z.number().nullable().optional(),
        organization_id: z.number().nullable().optional(),
        display_name: z.string().min(1, 'Silakan masukkan nama tampilan').optional(),
    })
    .refine(
        (data) => {
            if (data.applicant_type === 'person') {
                return !!data.person_id;
            }
            if (data.applicant_type === 'organization') {
                return !!data.organization_id;
            }
            return false;
        },
        {
            message: 'Silakan pilih person atau organisasi sesuai tipe',
            path: ['person_id'],
        }
    );
