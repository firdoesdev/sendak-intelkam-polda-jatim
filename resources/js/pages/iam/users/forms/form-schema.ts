import { z } from 'zod';

export const userSchema = z
    .object({
        id: z.number().optional(),
        name: z.string().min(1, 'Silakan masukkan nama'),
        email: z.string().email('Silakan masukkan email yang valid'),
        password: z
            .string()
            .min(6, 'Password harus terdiri dari minimal 6 karakter')
            .optional()
            .or(z.literal('')),
        password_confirmation: z
            .string()
            .min(6, 'Konfirmasi Password harus terdiri dari minimal 6 karakter')
            .optional()
            .or(z.literal('')),
    })
    .refine(
        (data) => {
            if (data.password || data.password_confirmation) {
                return data.password === data.password_confirmation;
            }
            return true;
        },
        {
            message: "Passwords don't match",
            path: ['password_confirmation'],
        }
    );

export const userCreateSchema = z
    .object({
        name: z.string().min(1, 'Silakan masukkan nama'),
        email: z.string().email('Silakan masukkan email yang valid'),
        password: z
            .string()
            .min(6, 'Password harus terdiri dari minimal 6 karakter'),
        password_confirmation: z
            .string()
            .min(6, 'Konfirmasi Password harus terdiri dari minimal 6 karakter'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });
