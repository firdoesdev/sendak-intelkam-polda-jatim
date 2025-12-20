import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import applicants from '@/routes/master-data/applicants';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { applicantSchema } from './form-schema';
import { Row } from '@tanstack/react-table';
import { ApplicantTypeOptions, TApplicant } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

type TDialogProps = {
    row: Row<TApplicant>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const EditApplicantForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const applicant = row.original;

    const form = useForm({
        resolver: zodResolver(applicantSchema),
        values: {
            id: applicant.id,
            applicant_type: applicant.applicant_type,
            person_id: applicant.person_id,
            organization_id: applicant.organization_id,
            display_name: applicant.display_name || '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const applicantType = form.watch('applicant_type');

    const handleSubmit = (values: z.infer<typeof applicantSchema>) => {
        router.put(applicants.update(applicant.id), values, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil mengubah data pemohon');
            },
            onError: () => {
                toast.error('Gagal mengubah data pemohon');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Edit Pemohon</DialogTitle>
                    <DialogDescription>
                        Ubah data pemohon. Klik simpan setelah selesai.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="applicant_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="applicant_type">Tipe Pemohon</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                form.setValue('person_id', null);
                                                form.setValue('organization_id', null);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih tipe pemohon" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ApplicantTypeOptions.map((option) => (
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

                        {applicantType === 'person' && (
                            <FormField
                                control={form.control}
                                name="person_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="person_id">Person ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="person_id"
                                                type="number"
                                                placeholder="Masukkan ID Person"
                                                value={field.value || ''}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? Number(e.target.value) : null
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {applicantType === 'organization' && (
                            <FormField
                                control={form.control}
                                name="organization_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="organization_id">Organization ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="organization_id"
                                                type="number"
                                                placeholder="Masukkan ID Organisasi"
                                                value={field.value || ''}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? Number(e.target.value) : null
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="display_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="display_name">
                                        Nama Tampilan (Opsional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="display_name"
                                            type="text"
                                            placeholder="Akan otomatis terisi jika kosong"
                                            {...field}
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
