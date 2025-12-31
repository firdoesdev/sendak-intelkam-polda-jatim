import { z } from 'zod';

export const permissionSchema = z.object({
    name: z.string().min(1, 'Silakan masukkan nama permission'),
    guard_name: z.string(),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;
