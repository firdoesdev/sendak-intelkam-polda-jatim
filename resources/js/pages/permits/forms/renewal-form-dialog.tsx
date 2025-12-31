import { Button } from '@/components/ui/button';
import {
    Dialog,
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
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import permits from '@/routes/permits';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import type { TPermit } from '@/types/entities/permit';

const renewalSchema = z.object({
    permit_id: z.number(),
    current_valid_to: z.string(),
    new_valid_to: z.string().min(1, 'Tanggal berlaku baru wajib diisi'),
    reason: z.string().optional(),
    status: z.enum(['draft', 'pending']),
});

type RenewalFormDialogProps = {
    permit: TPermit;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const RenewalFormDialog = ({ permit, open, onOpenChange }: RenewalFormDialogProps) => {
    const form = useForm({
        resolver: zodResolver(renewalSchema),
        defaultValues: {
            permit_id: permit.id,
            current_valid_to: permit.valid_to || '',
            new_valid_to: '',
            reason: '',
            status: 'pending' as 'draft' | 'pending',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof renewalSchema>) => {
        router.post(permits.renewals.store().url, values, {
            preserveState: true,
            replace: true,
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Permintaan perpanjangan izin berhasil dibuat');
                form.reset();
            },
            onError: (errors) => {
                console.error(errors);
                if (errors.permit_id) {
                    toast.error(errors.permit_id);
                } else if (errors.new_valid_to) {
                    toast.error(errors.new_valid_to);
                } else {
                    toast.error('Gagal membuat permintaan perpanjangan izin');
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Perpanjang Izin</DialogTitle>
                    <DialogDescription>
                        Ajukan perpanjangan untuk izin <strong>{permit.permit_number}</strong>
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Nomor Izin</FormLabel>
                                <FormControl>
                                    <div className="px-3 py-2 border rounded-md bg-muted text-sm">
                                        {permit.permit_number || '-'}
                                    </div>
                                </FormControl>
                            </FormItem>
                            
                            <FormItem>
                                <FormLabel>Pemohon</FormLabel>
                                <FormControl>
                                    <div className="px-3 py-2 border rounded-md bg-muted text-sm">
                                        {permit.applicant?.display_name || '-'}
                                    </div>
                                </FormControl>
                            </FormItem>
                        </div>

                        <FormItem>
                            <FormLabel>Masa Berlaku Saat Ini</FormLabel>
                            <FormControl>
                                <div className="px-3 py-2 border rounded-md bg-muted text-sm">
                                    {permit.valid_from && permit.valid_to
                                        ? `${format(new Date(permit.valid_from), 'dd MMM yyyy', { locale: localeId })} - ${format(new Date(permit.valid_to), 'dd MMM yyyy', { locale: localeId })}`
                                        : '-'}
                                </div>
                            </FormControl>
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="new_valid_to"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tanggal Berlaku Baru *</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(new Date(field.value), 'dd MMMM yyyy', { locale: localeId })
                                                    ) : (
                                                        <span>Pilih tanggal</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => {
                                                    field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                                }}
                                                disabled={(date) =>
                                                    permit.valid_to ? date <= new Date(permit.valid_to) : false
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alasan Perpanjangan</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tuliskan alasan perpanjangan izin..."
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Spinner />}
                                Ajukan Perpanjangan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
