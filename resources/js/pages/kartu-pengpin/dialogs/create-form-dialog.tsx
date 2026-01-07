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
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import kartuPengpin from '@/routes/kartu-pengpin';
import { useForm } from '@inertiajs/react';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';

export const CreateFormDialog = () => {
    const form = useForm({
        // Define form fields here
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        const { method, url } = kartuPengpin.store();
        e.preventDefault();
        // Handle form submission logic here
        form.submit(method, url, {});
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="default">
                    <PlusCircleIcon />
                    Tambah Informasi Kartu Pengpin
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-[90vh] max-w-2xl overflow-y-auto"
                aria-describedby="kartu-pengpin-form"
            >
                <DialogHeader>
                    <DialogTitle>Tambah Informasi Kartu Pengpin</DialogTitle>
                    <DialogDescription>
                        Isi data kartu pengpin baru pada form di bawah ini.
                    </DialogDescription>
                </DialogHeader>

                {/* TODO Form Kartu Pengpin */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                                <Label htmlFor="code">
                                    Kode Senjata
                                </Label>
                                <Input id="code" placeholder="ex: SEN-001" />
                            </FormItem>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="submit">
                            
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
