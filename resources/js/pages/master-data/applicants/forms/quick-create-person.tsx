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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import persons from '@/routes/master-data/persons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';
import { personSchema } from '@/pages/master-data/persons/forms/form-schema';
import { GenderOptions } from '@/pages/master-data/persons/types';

type QuickCreatePersonProps = {
    onPersonCreated?: (personId: number) => void;
};

export const QuickCreatePerson = ({ onPersonCreated }: QuickCreatePersonProps) => {
    const page = usePage<{ 
        policeUnits: Array<{ id: number; name: string; code: string }>; 
        organizations: Array<{ id: number; name: string }> 
    }>();
    const { policeUnits, organizations } = page.props;

    const form = useForm({
        resolver: zodResolver(personSchema),
        defaultValues: {
            national_id: '',
            full_name: '',
            birth_date: '',
            gender: 'unknown' as 'male' | 'female' | 'unknown',
            job_title: '',
            rank: '',
            address: '',
            city: '',
            province: '',
            police_unit_id: null,
            organization_id: null,
            photo: null,
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof personSchema>) => {
        const formData = new FormData();
        
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        router.post(persons.store().url, formData, {
            preserveState: true,
            replace: true,
            only: ['data', 'persons'],
            forceFormData: true,
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: (page: any) => {
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan person baru');
                form.reset();
                
                // Get the newly created person from the updated persons list
                const newPersons = page.props.persons;
                if (newPersons && newPersons.length > 0 && onPersonCreated) {
                    // Find the newly created person (should be the one with matching full_name)
                    const newPerson = newPersons.find((p: any) => p.full_name === values.full_name);
                    if (newPerson) {
                        onPersonCreated(newPerson.id);
                    }
                }
            },
            onError: () => {
                toast.error('Gagal menambahkan person baru');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4" />
                    Buat Person Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Buat Person Baru</DialogTitle>
                    <DialogDescription>
                        Tambahkan data person baru yang akan otomatis dipilih.
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
                                                    {policeUnits?.map((unit) => (
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
                                                    {organizations?.map((org) => (
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

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Spinner />}
                                Buat & Pilih
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
