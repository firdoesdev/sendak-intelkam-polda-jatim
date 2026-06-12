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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import handakPermits from '@/routes/handak-permits';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { TDialogProps, THandakPageProps } from '../types';
import { usageSchema } from './form-schema';

export const UsageFormDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const permit = row.original;
    const { stockBalances } = usePage<THandakPageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const organizationId = permit.applicant?.organization?.id ?? null;
    const organizationBalances = stockBalances.filter(
        (balance) => balance.organization_id === organizationId && Number(balance.balance) > 0,
    );

    const form = useForm<z.infer<typeof usageSchema>>({
        resolver: zodResolver(usageSchema),
        defaultValues: {
            usages: [{ material_type: '', unit: 'kg', quantity: 0, notes: null }],
        },
    });

    const usagesArray = useFieldArray({ control: form.control, name: 'usages' });

    const handleSubmit = (values: z.infer<typeof usageSchema>) => {
        router.post(handakPermits.recordUsage(permit.id).url, values, {
            preserveState: true,
            replace: true,
            only: ['data', 'stockBalances', 'errors'],
            onProgress: () => setIsSubmitting(true),
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Pemakaian bahan peledak berhasil dicatat');
                form.reset();
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] || 'Gagal mencatat pemakaian');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>Catat Pemakaian</DialogTitle>
                    <DialogDescription>
                        Catat pemakaian aktual bahan peledak untuk rekom{' '}
                        {permit.si_number || permit.permit_number || `#${permit.id}`}. Pemakaian akan mengurangi
                        saldo stok perusahaan.
                    </DialogDescription>
                </DialogHeader>

                {organizationBalances.length > 0 && (
                    <div className="bg-muted rounded-md p-3 text-sm">
                        <p className="mb-1 font-medium">Sisa stok saat ini:</p>
                        <ul className="list-inside list-disc">
                            {organizationBalances.map((balance) => (
                                <li key={`${balance.material_type}-${balance.unit}`}>
                                    {balance.material_type}: {Number(balance.balance).toLocaleString('id-ID')}{' '}
                                    {balance.unit}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            {usagesArray.fields.map((fieldItem, index) => (
                                <div key={fieldItem.id} className="grid grid-cols-12 items-start gap-2 rounded-md border p-2">
                                    <FormField
                                        control={form.control}
                                        name={`usages.${index}.material_type`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-5">
                                                <FormControl>
                                                    <Select
                                                        value={field.value || ''}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            const balance = organizationBalances.find(
                                                                (item) => item.material_type === value,
                                                            );
                                                            if (balance) {
                                                                form.setValue(`usages.${index}.unit`, balance.unit);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Jenis bahan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {organizationBalances.map((balance) => (
                                                                <SelectItem
                                                                    key={`${balance.material_type}-${balance.unit}`}
                                                                    value={balance.material_type}
                                                                >
                                                                    {balance.material_type}
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
                                        name={`usages.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="Jumlah"
                                                        value={field.value ?? ''}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`usages.${index}.unit`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormControl>
                                                    <Input placeholder="Satuan" value={field.value || ''} onChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="col-span-1"
                                        onClick={() => usagesArray.remove(index)}
                                        disabled={usagesArray.fields.length === 1}
                                    >
                                        <Trash2Icon className="text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => usagesArray.append({ material_type: '', unit: 'kg', quantity: 0, notes: null })}
                            >
                                <PlusIcon /> Tambah Baris
                            </Button>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Spinner />}
                                Catat Pemakaian
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
