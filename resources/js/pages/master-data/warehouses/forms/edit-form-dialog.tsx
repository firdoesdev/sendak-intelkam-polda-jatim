import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
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
import { Input } from '@/components/ui/input';
import warehouses from '@/routes/master-data/warehouses';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { warehouseSchema } from './form-schema';
import { Row } from '@tanstack/react-table';
import { WarehouseStorageTypeOptions, TWarehouse } from '../types';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { TPoliceUnit } from '@/types/entities/police-unit';
import { TOrganization } from '@/types/entities/organization';

type TDialogProps = {
    row: Row<TWarehouse>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const EditWarehouseForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const page = usePage<{
        policeUnits: TPoliceUnit[];
        organizations: TOrganization[];
    }>();

    const form = useForm({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            id: row?.original.id || undefined,
            code: row?.original.code || '',
            name: row?.original.name || '',
            storage_type: row?.original.storage_type || '',
            police_unit_id: row?.original.police_unit_id || 0,
            organization_id: row?.original.organization_id || null,
            address: row?.original.address || '',
            city: row?.original.city || '',
            province: row?.original.province || '',
            is_active: row?.original.is_active || true,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof warehouseSchema>) => {
        router.put(warehouses.update(row.original.id).url, values, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil mengupdate gudang');
            },
            onError: () => {
                toast.error('Gagal mengupdate gudang');
            },
            onFinish: () => {
                setIsSubmitting(false);
                form.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Warehouse</DialogTitle>
                    <DialogDescription>
                        Edit data gudang pada form di bawah ini. {row.original.name}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
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
                                                placeholder="ex: Gudang Senjata"
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
                                        <FormLabel htmlFor="storage_type">
                                            Storage Type
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select storage type" />
                                                </SelectTrigger>
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="police_unit_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="police_unit_id">
                                            Police Unit
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value?.toString()}
                                                onValueChange={(value) =>
                                                    field.onChange(parseInt(value))
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select police unit" />
                                                </SelectTrigger>
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
                                        <FormLabel htmlFor="organization_id">
                                            Organization (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value?.toString() || ''}
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        value ? parseInt(value) : null
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select organization (optional)" />
                                                </SelectTrigger>
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
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                            <Button type="submit" variant="default" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="mr-2" /> Saving...
                                    </>
                                ) : (
                                    'Save changes'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
