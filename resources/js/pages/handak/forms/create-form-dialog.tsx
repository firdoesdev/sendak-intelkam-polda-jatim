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
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import handakPermits from '@/routes/handak-permits';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { THandakPageProps } from '../types';
import { handakPermitSchema } from './form-schema';
import { HandakPermitFormFields } from './permit-form-fields';

export const CreateHandakPermitForm = () => {
    const { division } = usePage<THandakPageProps>().props;

    const form = useForm<z.infer<typeof handakPermitSchema>>({
        resolver: zodResolver(handakPermitSchema),
        defaultValues: {
            division_id: division?.id ?? 0,
            applicant_id: 0,
            recommendation_type: undefined,
            parent_permit_id: null,
            warehouse_id: null,
            status: 'draft',
            valid_from: null,
            valid_to: null,
            representative_name: null,
            representative_title: null,
            representative_nationality: 'Indonesia',
            purpose: null,
            activity_location: null,
            materials: [
                { material_type: '', item_name: '', weight: 0, quantity: 1, unit: 'kg', notes: null },
            ],
            references: [],
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof handakPermitSchema>) => {
        router.post(handakPermits.store().url, values, {
            preserveState: true,
            replace: true,
            only: ['data', 'parentOptions', 'stockBalances', 'errors'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan rekom handak');
                form.reset();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'Gagal menambahkan rekom handak');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircleIcon />
                    Tambah Rekom
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
                <DialogHeader>
                    <DialogTitle>Tambah Rekom Handak</DialogTitle>
                    <DialogDescription>
                        Buat rekom bahan peledak (Ijin Gudang, P3, P2, atau P1). Klik simpan setelah selesai.
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
