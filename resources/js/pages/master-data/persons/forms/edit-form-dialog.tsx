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
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import persons from '@/routes/master-data/persons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { personSchema } from './form-schema';
import { Row } from '@tanstack/react-table';
import { GenderOptions, TPerson } from '../types';
import { useState } from 'react';

type TDialogProps = {
    row: Row<TPerson>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const EditPersonForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const person = row.original;
    const page = usePage<{ 
        policeUnits: Array<{ id: number; name: string; code: string }>; 
        organizations: Array<{ id: number; name: string }> 
    }>();
    const { policeUnits, organizations } = page.props;

    const form = useForm({
        resolver: zodResolver(personSchema),
        values: {
            national_id: person.national_id || '',
            full_name: person.full_name,
            birth_date: person.birth_date || '',
            gender: person.gender,
            job_title: person.job_title || '',
            rank: person.rank || '',
            address: person.address || '',
            city: person.city || '',
            province: person.province || '',
            police_unit_id: person.police_unit_id,
            organization_id: person.organization_id,
            photo: null,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof personSchema>) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        router.post(persons.update(person.id).url, formData, {
            preserveState: true,
            replace: true,
            only: ['data'],
            forceFormData: true,
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil mengubah data person');
            },
            onError: () => {
                toast.error('Gagal mengubah data person');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Person</DialogTitle>
                    <DialogDescription>
                        Ubah data person. Klik simpan setelah selesai.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="full_name">Nama Lengkap *</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="full_name"
                                                type="text"
                                                placeholder="Nama lengkap"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="national_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="national_id">NIK/NRP</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="national_id"
                                                type="text"
                                                placeholder="NIK atau NRP"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="birth_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="birth_date">Tanggal Lahir</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="birth_date"
                                                type="date"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gender">Jenis Kelamin *</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GenderOptions.map((option) => (
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="job_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="job_title">Jabatan</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="job_title"
                                                type="text"
                                                placeholder="Jabatan"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rank"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="rank">Pangkat</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="rank"
                                                type="text"
                                                placeholder="Pangkat (jika polisi)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="address">Alamat</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="address"
                                            placeholder="Alamat lengkap"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="city">Kota</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="city"
                                                type="text"
                                                placeholder="Kota"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="province">Provinsi</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="province"
                                                type="text"
                                                placeholder="Provinsi"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="police_unit_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="police_unit_id">Satuan Polisi</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value?.toString() || ''}
                                                onValueChange={(value) =>
                                                    field.onChange(value ? Number(value) : null)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih satuan polisi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {policeUnits.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                                            {unit.name} ({unit.code})
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
                                name="organization_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="organization_id">Organisasi</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value?.toString() || ''}
                                                onValueChange={(value) =>
                                                    field.onChange(value ? Number(value) : null)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih organisasi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {organizations.map((org) => (
                                                        <SelectItem key={org.id} value={org.id.toString()}>
                                                            {org.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel htmlFor="photo">Foto (kosongkan jika tidak ingin mengubah)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            id="photo"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={(event) =>
                                                onChange(event.target.files?.[0] || null)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {person.photo_path && (
                            <div className="text-sm text-muted-foreground">
                                Foto saat ini: {person.photo_path.split('/').pop()}
                            </div>
                        )}

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
