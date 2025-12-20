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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import warehouses from '@/routes/master-data/warehouses';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircleIcon } from 'lucide-react';
import { warehouseSchema } from './form-schema';
import { WarehouseStorageTypeOptions } from '../types';
import { TPoliceUnit } from '@/types/entities/police-unit';
import { TOrganization } from '@/types/entities/organization';



export const CreateWarehouseForm = () => {
    const page = usePage<{
        policeUnits: TPoliceUnit[];
        organizations: TOrganization[];
    }>();

    const form = useForm({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            code: '',
            name: '',
            storage_type: '',
            police_unit_id: 0,
            organization_id: null,
            address: '',
            city: '',
            province: 'Jawa Timur',
            is_active: true,
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof warehouseSchema>) => {
        router.post(warehouses.store().url, values, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan gudang baru');
            },
            onError: () => {
                toast.error('Gagal menambahkan gudang baru');
            },
            onFinish: () => {
                setIsSubmitting(false);
                form.reset();
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Form {...form}>
                <DialogTrigger asChild>
                    <Button type="button" variant="default">
                        <PlusCircleIcon />
                        Tambah Gudang
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto" aria-describedby="warehouse-form">
                    <DialogHeader>
                        <DialogTitle>Tambah Gudang</DialogTitle>
                        <DialogDescription>
                            Isi data gudang baru pada form di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="code">Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="code"
                                                placeholder="ex: WH-001"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="ex: Gudang Senjata Polda"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="storage_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="storage_type">Storage Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih tipe penyimpanan" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {WarehouseStorageTypeOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="police_unit_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="police_unit_id">Police Unit</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(parseInt(value))
                                            }
                                            defaultValue={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih satuan kepolisian" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {page.props.policeUnits.map((unit) => (
                                                    <SelectItem
                                                        key={unit.id}
                                                        value={unit.id.toString()}
                                                    >
                                                        {unit.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="organization_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="organization_id">
                                            Organization (Optional)
                                        </FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(
                                                    value ? parseInt(value) : null
                                                )
                                            }
                                            defaultValue={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih organisasi (opsional)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {page.props.organizations.map((org) => (
                                                    <SelectItem
                                                        key={org.id}
                                                        value={org.id.toString()}
                                                    >
                                                        {org.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="address">Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address"
                                                type="text"
                                                placeholder="Enter address"
                                                {...field}
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
                                        <FormLabel htmlFor="city">City</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="city"
                                                type="text"
                                                placeholder="ex: Surabaya"
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
                                        <FormLabel htmlFor="province">Province</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="province"
                                                type="text"
                                                placeholder="ex: Jawa Timur"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    );
};
