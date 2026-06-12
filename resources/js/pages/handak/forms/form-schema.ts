import { z } from 'zod';

export const handakMaterialSchema = z.object({
    material_type: z.string().min(1, 'Silakan pilih jenis bahan peledak'),
    item_name: z.string().min(1, 'Nama item wajib diisi'),
    weight: z.number({ message: 'Berat wajib diisi' }).positive('Berat harus lebih dari 0'),
    quantity: z.number({ message: 'Jumlah wajib diisi' }).int().min(1, 'Jumlah minimal 1'),
    unit: z.string().min(1, 'Satuan wajib diisi'),
    notes: z.string().nullable().optional(),
});

export const handakReferenceSchema = z.object({
    reference_type: z.enum([
        'company_request',
        'parent_si',
        'warehouse_si',
        'esdm_letter',
        'polres_recommendation',
        'other',
    ]),
    document_number: z.string().min(1, 'Nomor surat wajib diisi'),
    document_date: z.string().nullable().optional(),
    issuer: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
});

export const handakPermitSchema = z
    .object({
        id: z.number().optional(),
        division_id: z.number({ message: 'Divisi tidak ditemukan' }),
        applicant_id: z.number({ message: 'Silakan pilih pemohon' }).min(1, 'Silakan pilih pemohon'),
        recommendation_type: z.enum(['P1', 'P2', 'P3', 'IJIN_GUDANG'], {
            message: 'Silakan pilih jenis rekom',
        }),
        parent_permit_id: z.number().nullable().optional(),
        warehouse_id: z.number().nullable().optional(),
        status: z.enum(['draft', 'pending']).optional(),
        valid_from: z.string().nullable().optional(),
        valid_to: z.string().nullable().optional(),
        representative_name: z.string().nullable().optional(),
        representative_title: z.string().nullable().optional(),
        representative_nationality: z.string().nullable().optional(),
        purpose: z.string().nullable().optional(),
        activity_location: z.string().nullable().optional(),
        materials: z.array(handakMaterialSchema).min(1, 'Minimal satu jenis bahan peledak'),
        references: z.array(handakReferenceSchema).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.recommendation_type === 'IJIN_GUDANG') {
            if (!data.warehouse_id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['warehouse_id'],
                    message: 'Ijin Gudang wajib memilih gudang penyimpanan',
                });
            }
            if (!data.valid_from) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['valid_from'],
                    message: 'Masa berlaku Ijin Gudang wajib diisi manual',
                });
            }
            if (!data.valid_to) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['valid_to'],
                    message: 'Masa berlaku mengikuti rekomendasi instansi terkait (mis. ESDM)',
                });
            }
        }

        if (['P1', 'P2'].includes(data.recommendation_type) && !data.parent_permit_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['parent_permit_id'],
                message: 'Rekom P1/P2 wajib merujuk rekom P3 sebagai induk',
            });
        }
    });

export const issueSiSchema = z.object({
    si_number: z.string().min(1, 'No SI wajib diisi'),
});

export const usageSchema = z.object({
    usages: z
        .array(
            z.object({
                material_type: z.string().min(1, 'Silakan pilih jenis bahan peledak'),
                unit: z.string().min(1, 'Satuan wajib diisi'),
                quantity: z.number({ message: 'Jumlah wajib diisi' }).positive('Jumlah harus lebih dari 0'),
                notes: z.string().nullable().optional(),
            }),
        )
        .min(1, 'Minimal satu pemakaian'),
});
