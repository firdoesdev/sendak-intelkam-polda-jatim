import { z } from 'zod';

export const roleSchema = z.object({
    name: z.string().min(1, 'Silakan masukkan nama role'),
    guard_name: z.string(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
