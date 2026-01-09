import { Button } from '@/components/ui/button';
import {
    Dialog,
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
import { Textarea } from '@/components/ui/textarea';
import weapons from '@/routes/weapons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { weaponSchema } from './form-schema';
import { WeaponStatusOptions, WeaponConditionOptions, PermitTypeOptions, TDialogProps } from '../types';

export const EditWeaponForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const page = usePage<{
        warehouses: Array<{ id: number; name: string; code: string }>;
    }>();

    const form = useForm({
        resolver: zodResolver(weaponSchema),
        defaultValues: {
            id: row?.original.id || undefined,
            code: row?.original.code || '',
            name: row?.original.name || '',
            permit_type: row?.original.permit_type || '',
            weapon_type: row?.original.weapon_type || '',
            serial_number: row?.original.serial_number || '',
            manufacturer: row?.original.manufacturer || '',
            caliber: row?.original.caliber || '',
            acquisition_date: row?.original.acquisition_date || '',
            condition: row?.original.condition || 'good',
            status: row?.original.status || 'available',
            warehouse_id: row?.original.warehouse_id || 0,
            notes: row?.original.notes || '',
            is_active: row?.original.is_active ?? true,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof weaponSchema>) => {
        router.put(weapons.update(row.original.id).url, values, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil mengupdate senjata');
            },
            onError: () => {
                toast.error('Gagal mengupdate senjata');
            },
            onFinish: () => {
                setIsSubmitting(false);
                form.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Form {...form}>
                <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl" aria-describedby="weapon-form">
                    <DialogHeader>
                        <DialogTitle>Edit Senjata</DialogTitle>
                        <DialogDescription>
                            Edit data senjata: {row?.original.name} ({row?.original.code})
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                           <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="code">Kode Senjata</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="code"
                                                    placeholder="ex: SEN-001"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="serial_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="serial_number">Nomor Seri</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="serial_number"
                                                    placeholder="ex: SN123456789"
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Nama Senjata</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="ex: Pistol Glock 17"
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
                                    name="manufacturer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="manufacturer">Pembuat</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="manufacturer"
                                                    placeholder="ex: Glock"
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
                                    name="caliber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="caliber">Kaliber</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="caliber"
                                                    placeholder="ex: 9mm"
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
                                    name="acquisition_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="acquisition_date">Tanggal Akuisisi</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="acquisition_date"
                                                    type="date"
                                                    {...field}
                                                    value={field.value || ''}
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
                                    name="permit_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="permit_type">Tipe Izin</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger id="permit_type" className='w-full'>
                                                        <SelectValue placeholder="Pilih tipe izin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PermitTypeOptions.map((option) => (
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
                                    name="weapon_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="weapon_type">Jenis Senjata</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="weapon_type"
                                                    placeholder="ex: Pistol, Rifle"
                                                    {...field}
                                                    value={field.value || ''}
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
                                    name="warehouse_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="warehouse_id">Gudang</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                defaultValue={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger id="warehouse_id" className='w-full'>
                                                        <SelectValue placeholder="Pilih gudang" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {page.props.warehouses.map((warehouse) => (
                                                        <SelectItem
                                                            key={warehouse.id}
                                                            value={warehouse.id.toString()}
                                                        >
                                                            {warehouse.name}
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
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="condition">Kondisi</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger id="condition" className='w-full'>
                                                        <SelectValue placeholder="Pilih kondisi" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {WeaponConditionOptions.map((option) => (
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
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="status">Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger id="status" className='w-full'>
                                                        <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {WeaponStatusOptions.map((option) => (
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
                            </div>

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="notes">Catatan</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                id="notes"
                                                placeholder="Catatan tambahan..."
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Spinner />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    );
};
