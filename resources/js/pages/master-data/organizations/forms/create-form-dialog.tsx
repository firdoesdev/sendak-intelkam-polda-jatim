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
import organizations from '@/routes/master-data/organizations';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircleIcon } from 'lucide-react';
import { organizationSchema } from './form-schema';
import { OrgTypeOptions } from '../types';



export const CreateOrganizationForm = () => {

    const form = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: '',
            org_type: 'company',
            registration_no: '',
            tax_no: '',
            address: '',
            city: '',
            province: '',
            email: '',
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof organizationSchema>) => {
        
        // Handle form submission logic here
        router.post(organizations.store().url, values, {
            preserveState: true,
            replace: true,
            only:['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan organisasi baru');
            },
            onError: () => {
                toast.error('Gagal menambahkan organisasi baru');
            },
            onFinish: () => {
                setIsSubmitting(false);
                form.reset();
            }
        });
        
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Form {...form}>
                <DialogTrigger asChild>
                    <Button type="button" variant="default">
                        <PlusCircleIcon/>
                        Tambah Organisasi
                    </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="create-organization">
                    <DialogHeader>
                        <DialogTitle>Tambah Organisasi</DialogTitle>
                        <DialogDescription>
                            Isi data organisasi baru pada form di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">
                                            Nama
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Masukkan nama organisasi"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="org_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="org_type">
                                            Tipe Organisasi
                                        </FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder="Pilih tipe organisasi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {OrgTypeOptions.map((option) => (
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
                                name="registration_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="registration_no">
                                            No. Registrasi (NIB/SIUP)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="registration_no"
                                                type="text"
                                                placeholder="Masukkan nomor registrasi"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tax_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="tax_no">
                                            NPWP
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="tax_no"
                                                type="text"
                                                placeholder="Masukkan NPWP"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="address">
                                            Alamat
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address"
                                                type="text"
                                                placeholder="Masukkan alamat"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="city">
                                            Kota
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="city"
                                                type="text"
                                                placeholder="Masukkan kota"
                                                {...field}
                                                value={field.value || ''}
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
                                        <FormLabel htmlFor="province">
                                            Provinsi
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="province"
                                                type="text"
                                                placeholder="Masukkan provinsi"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Masukkan email"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    );
};
