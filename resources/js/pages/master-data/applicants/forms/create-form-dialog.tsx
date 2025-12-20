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
import applicants from '@/routes/master-data/applicants';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircleIcon } from 'lucide-react';
import { applicantSchema } from './form-schema';
import { ApplicantTypeOptions } from '../types';

export const CreateApplicantForm = () => {
    const form = useForm({
        resolver: zodResolver(applicantSchema),
        defaultValues: {
            applicant_type: 'person' as 'person' | 'organization',
            person_id: null,
            organization_id: null,
            display_name: '',
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const applicantType = form.watch('applicant_type');

    const handleSubmit = (values: z.infer<typeof applicantSchema>) => {
        router.post(applicants.store().url, values, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan pemohon baru');
                form.reset();
            },
            onError: () => {
                toast.error('Gagal menambahkan pemohon baru');
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
                    Tambah Pemohon
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Tambah Pemohon Baru</DialogTitle>
                    <DialogDescription>
                        Tambahkan data pemohon baru. Klik simpan setelah selesai.
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
                                                form.setValue('display_name', '');
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
