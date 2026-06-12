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
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import handakPermits from '@/routes/handak-permits';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { TDialogProps } from '../types';
import { handakPermitSchema } from './form-schema';
import { HandakPermitFormFields } from './permit-form-fields';

export const EditHandakPermitForm = ({ row, open, onOpenChange }: TDialogProps) => {
    const permit = row.original;

    const form = useForm<z.infer<typeof handakPermitSchema>>({
        resolver: zodResolver(handakPermitSchema),
        values: {
            id: permit.id,
            division_id: permit.division_id,
            applicant_id: permit.applicant_id,
            recommendation_type: (permit.recommendation_type ?? 'IJIN_GUDANG') as 'P1' | 'P2' | 'P3' | 'IJIN_GUDANG',
            parent_permit_id: permit.parent_permit_id,
            warehouse_id: permit.warehouse_id,
            status: permit.status === 'pending' ? 'pending' : 'draft',
            valid_from: permit.valid_from,
            valid_to: permit.valid_to,
            representative_name: permit.representative_name,
            representative_title: permit.representative_title,
            representative_nationality: permit.representative_nationality,
            purpose: permit.purpose,
            activity_location: permit.activity_location,
            materials:
                permit.explosives_materials?.map((material) => ({
                    material_type: material.material_type,
                    item_name: material.item_name,
                    weight: Number(material.weight),
                    quantity: material.quantity,
                    unit: material.unit,
                    notes: material.notes,
                })) ?? [],
            references:
                permit.handak_references?.map((reference) => ({
                    reference_type: reference.reference_type as
                        | 'company_request'
                        | 'parent_si'
                        | 'warehouse_si'
                        | 'esdm_letter'
                        | 'polres_recommendation'
                        | 'other',
                    document_number: reference.document_number,
                    document_date: reference.document_date,
                    issuer: reference.issuer,
                    notes: reference.notes,
                })) ?? [],
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof handakPermitSchema>) => {
        router.put(handakPermits.update(permit.id).url, values, {
            preserveState: true,
            replace: true,
            only: ['data', 'parentOptions', 'stockBalances', 'errors'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Berhasil memperbarui rekom handak');
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'Gagal memperbarui rekom handak');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle>Edit Rekom Handak</DialogTitle>
                    <DialogDescription>
                        Ubah data rekom {permit.permit_number || `#${permit.id}`}. Hanya rekom berstatus
                        draft/pending yang dapat diubah.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <HandakPermitFormFields />
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
