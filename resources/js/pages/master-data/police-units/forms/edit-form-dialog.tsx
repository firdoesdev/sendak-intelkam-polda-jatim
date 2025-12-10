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
import { Input } from '@/components/ui/input';
import policeUnits from '@/routes/master-data/police-units';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { policeUnitSchema } from './form-schema';
import { Row } from '@tanstack/react-table';
import { PoliceUnitTypeOptions, TPoliceUnit } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

type TDialogProps = {
    row: Row<TPoliceUnit>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const EditPoliceUnitForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const form = useForm({
        resolver: zodResolver(policeUnitSchema),
        defaultValues: {
            id: row?.original.id || undefined,
            code: row?.original.code || '',
            name: row?.original.name || '',
            unit_type: row?.original.unit_type || '',
            region: row?.original.region || '',
            address: row?.original.address || '',
            parent_id: row?.original.parent_id || null,
            is_active: row?.original.is_active || true,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof policeUnitSchema>) => {
        // Handle form submission logic here
        router.put(policeUnits.update(row.original.id).url, values, {
            preserveState: true,
            replace: true,
            only:['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                // close the dialog if needed
                onOpenChange(false);
                toast.success('Berhasil mengupdate police unit');

            },
            onError: () => {
                // Handle validation errors if needed
                toast.error('Gagal mengupdate police unit');
            },
            onFinish: () => {
                setIsSubmitting(false);
                form.reset();
            }
        });
        
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>Edit Police Unit</DialogTitle>
                    <DialogDescription>
                        Edit data police unit pada form di bawah ini. {row.original.name}
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
                                        <FormLabel htmlFor="code">
                                            Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="ex: John Doe"
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
                                        <FormLabel htmlFor="name">
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="ex: John Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="unit_type">
                                            Unit Type
                                        </FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder="Select a unit type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PoliceUnitTypeOptions.map((option) => (
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
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="address">
                                            Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="address"
                                                type="text"
                                                placeholder="Enter your address"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="region">
                                            Region
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="region"
                                                type="text"
                                                placeholder="Enter your region"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='mt-4'>
                            <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                            <Button type="submit" variant="default" disabled={isSubmitting} >
                                {isSubmitting ? <><Spinner className="mr-2" /> Saving...</> : 'Save changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
