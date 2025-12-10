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
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import policeUnits from '@/routes/master-data/police-units';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircleIcon } from 'lucide-react';
import { policeUnitSchema } from './form-schema';



export const CreatePoliceUnitForm = () => {

    const form = useForm({
        resolver: zodResolver(policeUnitSchema),
        defaultValues: {
            code: '',
            name: '',
            unit_type: 'POLRES',
            region: '',
            address: '',
            parent_id: null,
            is_active: true,
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (values: z.infer<typeof policeUnitSchema>) => {
        
        // Handle form submission logic here
        // For example, you can send the form data to the server
        router.post(policeUnits.store().url, values, {
            preserveState: true,
            replace: true,
            only:['data'],
            onProgress: () => {
                setIsSubmitting(true);
            },
            onSuccess: () => {
                // close the dialog if needed
                setIsDialogOpen(false);
                toast.success('Berhasil menambahkan user baru');
            },
            onError: () => {
                // Handle validation errors if needed
                toast.error('Gagal menambahkan user baru');
            },
            onFinish: () => {
                setIsSubmitting(false);
                form.reset();
            }
        });
        
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Form {...form}>
                <DialogTrigger asChild>
                    <Button type="button" variant="default">
                        <PlusCircleIcon/>
                        Tambah Unit
                    </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="firdaus">
                    <DialogHeader>
                        <DialogTitle>Tambah Unit</DialogTitle>
                        <DialogDescription>
                            Isi data unit baru pada form di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Form to add user goes here */}
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
