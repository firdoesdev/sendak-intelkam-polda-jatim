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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import handakPermits from '@/routes/handak-permits';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { TDialogProps } from '../types';
import { issueSiSchema } from './form-schema';

export const IssueSiDialog = ({ row, open, onOpenChange }: TDialogProps) => {
    const permit = row.original;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof issueSiSchema>>({
        resolver: zodResolver(issueSiSchema),
        defaultValues: { si_number: permit.si_number || '' },
    });

    const handleSubmit = (values: z.infer<typeof issueSiSchema>) => {
        router.post(handakPermits.issueSi(permit.id).url, values, {
            preserveState: true,
            replace: true,
            only: ['data', 'parentOptions', 'errors'],
            onProgress: () => setIsSubmitting(true),
            onSuccess: () => {
                onOpenChange(false);
                toast.success('No SI berhasil diterbitkan');
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] || 'Gagal menerbitkan No SI');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Terbitkan No SI</DialogTitle>
                    <DialogDescription>
                        Catat nomor Surat Izin Kapolri untuk rekom {permit.permit_number || `#${permit.id}`}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="si_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No SI</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="cth. SI/4555/XI/YAN.2.12./2024"
                                            value={field.value || ''}
                                            onChange={field.onChange}
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
                                Terbitkan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
