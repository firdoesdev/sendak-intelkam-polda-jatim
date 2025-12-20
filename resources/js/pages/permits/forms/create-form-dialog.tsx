import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import permits from '@/routes/permits';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircleIcon } from 'lucide-react';
import { permitSchema } from './form-schema';
import { PermitTypeOptions, PermitStatusOptions } from '../types';

export const CreatePermitForm = () => {
    const form = useForm({
        resolver: zodResolver(permitSchema),
        defaultValues: {
            division_id: 0,
            applicant_id: 0,
            permit_type: 'SENPI' as 'SENPI' | 'POLSUS' | 'HANDAK' | 'SPORT',
            status: 'draft' as 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled',
            valid_from: null,
            valid_to: null,
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof permitSchema>) => {
        router.post(permits.store().url, values, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan izin baru');
                form.reset();
            },
            onError: () => {
                toast.error('Gagal menambahkan izin baru');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircleIcon />
                    Tambah Izin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Izin Baru</DialogTitle>
                    <DialogDescription>
                        Tambahkan data izin baru. Klik simpan setelah selesai.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="division_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="division_id">Divisi ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="division_id"
                                            type="number"
                                            placeholder="Masukkan ID Divisi"
                                            value={field.value || ''}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value ? Number(e.target.value) : 0
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="applicant_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="applicant_id">Pemohon ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="applicant_id"
                                            type="number"
                                            placeholder="Masukkan ID Pemohon"
                                            value={field.value || ''}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value ? Number(e.target.value) : 0
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="permit_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="permit_type">Tipe Izin</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih tipe izin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PermitTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="status">Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PermitStatusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="valid_from"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="valid_from">Berlaku Dari</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="valid_from"
                                            type="date"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="valid_to"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="valid_to">Berlaku Hingga</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="valid_to"
                                            type="date"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Spinner />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
