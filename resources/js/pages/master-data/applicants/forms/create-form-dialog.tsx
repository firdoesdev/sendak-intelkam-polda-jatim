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
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircleIcon } from 'lucide-react';
import { applicantSchema } from './form-schema';
import { ApplicantTypeOptions } from '../types';
import { QuickCreatePerson } from './quick-create-person';

export const CreateApplicantForm = () => {
    const page = usePage<{ persons: Array<{ id: number; full_name: string; national_id: string | null }>; organizations: Array<{ id: number; name: string; org_type: string | null }> }>();
    const { persons, organizations } = page.props;

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
                            <>
                                <FormField
                                    control={form.control}
                                    name="person_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="person_id">Person</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value?.toString() || ''}
                                                    onValueChange={(value) => {
                                                        field.onChange(value ? Number(value) : null);
                                                        const person = persons.find(p => p.id === Number(value));
                                                        if (person && !form.getValues('display_name')) {
                                                            form.setValue('display_name', person.full_name);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih person" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {persons.map((person) => (
                                                            <SelectItem key={person.id} value={person.id.toString()}>
                                                                {person.full_name}
                                                                {person.national_id && ` (${person.national_id})`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end">
                                    <QuickCreatePerson 
                                        onPersonCreated={(personId) => {
                                            form.setValue('person_id', personId);
                                            const person = persons.find(p => p.id === personId);
                                            if (person && !form.getValues('display_name')) {
                                                form.setValue('display_name', person.full_name);
                                            }
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        {applicantType === 'organization' && (
                            <FormField
                                control={form.control}
                                name="organization_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="organization_id">Organisasi</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value?.toString() || ''}
                                                onValueChange={(value) => {
                                                    field.onChange(value ? Number(value) : null);
                                                    const org = organizations.find(o => o.id === Number(value));
                                                    if (org && !form.getValues('display_name')) {
                                                        form.setValue('display_name', org.name);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih organisasi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {organizations.map((org) => (
                                                        <SelectItem key={org.id} value={org.id.toString()}>
                                                            {org.name}
                                                            {org.org_type && ` (${org.org_type})`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
