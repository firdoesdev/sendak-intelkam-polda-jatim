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
import permits from '@/routes/permits';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { permitSchema } from './form-schema';
import { Row } from '@tanstack/react-table';
import { PermitTypeOptions, PermitStatusOptions, TPermit } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

type TDialogProps = {
    row: Row<TPermit>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const EditPermitForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const permit = row.original;
    const page = usePage<{ divisions: Array<{ id: number; code: string; name: string }>; applicants: Array<{ id: number; display_name: string; applicant_type: string }> }>();
    const { divisions, applicants } = page.props;

    const form = useForm({
        resolver: zodResolver(permitSchema),
        values: {
            id: permit.id,
            division_id: permit.division_id,
            applicant_id: permit.applicant_id,
            permit_type: permit.permit_type as 'SENPI' | 'POLSUS' | 'HANDAK' | 'SPORT',
            status: permit.status,
            valid_from: permit.valid_from,
            valid_to: permit.valid_to,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof permitSchema>) => {
        router.put(permits.update(permit.id), values, {
            preserveState: true,
            replace: true,
            only: ['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil mengubah data izin');
            },
            onError: () => {
                toast.error('Gagal mengubah data izin');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Izin</DialogTitle>
                    <DialogDescription>
                        Ubah data izin. Klik simpan setelah selesai.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="division_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="division_id">Divisi</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value?.toString() || ''}
                                            onValueChange={(value) =>
                                                field.onChange(value ? Number(value) : 0)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih divisi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {divisions.map((division) => (
                                                    <SelectItem key={division.id} value={division.id.toString()}>
                                                        {division.name} ({division.code})
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
                            name="applicant_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="applicant_id">Pemohon</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value?.toString() || ''}
                                            onValueChange={(value) =>
                                                field.onChange(value ? Number(value) : 0)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih pemohon" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {applicants.map((applicant) => (
                                                    <SelectItem key={applicant.id} value={applicant.id.toString()}>
                                                        {applicant.display_name}
                                                        <span className="text-muted-foreground text-xs ml-2">
                                                            ({applicant.applicant_type})
                                                        </span>
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
                            name="permit_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="permit_type">Tipe Izin</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih tipe izin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PermitTypeOptions.map((option) => (
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="status">Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PermitStatusOptions.map((option) => (
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
                            name="valid_from"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="valid_from">Berlaku Dari</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="valid_from"
                                            type="date"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="valid_to"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="valid_to">Berlaku Hingga</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="valid_to"
                                            type="date"
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
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
