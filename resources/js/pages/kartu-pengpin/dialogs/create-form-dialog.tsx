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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import kartuPengpin from '@/routes/kartu-pengpin';
import { useForm } from '@inertiajs/react';
import { PlusCircleIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

type Permit = {
    id: number;
    permit_number: string;
    permit_type: string;
};

type Person = {
    id: number;
    full_name: string;
    national_id: string;
};

type Weapon = {
    id: number;
    serial_number: string;
    name: string;
};

type CreateFormDialogProps = {
    permits?: Permit[];
    persons?: Person[];
    weapons?: Weapon[];
};

export const CreateFormDialog = ({
    permits = [],
    persons = [],
    weapons = [],
}: CreateFormDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        permit_id: '',
        person_id: '',
        weapon_id: '',
        issue_date: '',
        expiry_date: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        const { url } = kartuPengpin.store();

        post(url, {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
            onFlash: (flash:{success?: string}) => {
                toast.success(flash ? flash.success : 'Kartu Pengpin berhasil diterbitkan');
            }
        });
    };

 
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="default">
                    <PlusCircleIcon />
                    Terbitkan Kartu Pengpin
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-[90vh] max-w-2xl overflow-y-auto"
                aria-describedby="kartu-pengpin-form"
            >
                <DialogHeader>
                    <DialogTitle>
                        Terbitkan Kartu Penguasaan Pinjam Pakai Senjata Api
                    </DialogTitle>
                    <DialogDescription>
                        Isi data kartu pengpin untuk penguasaan sementara
                        senjata api nonorganik (milik TNI/Polri) untuk tugas
                        keamanan. Hanya berlaku untuk izin POLSUS.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className='space-y-2'>
                            <Label htmlFor="permit_id">
                                Izin POLSUS{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.permit_id}
                                onValueChange={(value) =>
                                    setData('permit_id', value)
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih izin POLSUS" />
                                </SelectTrigger>
                                <SelectContent>
                                    {permits.length === 0 ? (
                                        <div className="p-2 text-sm text-muted-foreground">
                                            Tidak ada izin POLSUS tersedia
                                        </div>
                                    ) : (
                                        permits.map((permit) => (
                                            <SelectItem
                                                key={permit.id}
                                                value={String(permit.id)}
                                            >
                                                {permit.permit_number} -{' '}
                                                {permit.permit_type}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.permit_id && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.permit_id}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="person_id">
                                Pemegang Kartu{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.person_id}
                                onValueChange={(value) =>
                                    setData('person_id', value)
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih pemegang kartu (Satpol PP, PPNS, Satpam, dll)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {persons.length === 0 ? (
                                        <div className="p-2 text-sm text-muted-foreground">
                                            Tidak ada data person tersedia
                                        </div>
                                    ) : (
                                        persons.map((person) => (
                                            <SelectItem
                                                key={person.id}
                                                value={String(person.id)}
                                            >
                                                {person.full_name} -{' '}
                                                {person.national_id}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.person_id && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.person_id}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="weapon_id">
                                Senjata Api Nonorganik{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.weapon_id}
                                onValueChange={(value) =>
                                    setData('weapon_id', value)
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih senjata api yang dipinjamkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {weapons.length === 0 ? (
                                        <div className="p-2 text-sm text-muted-foreground">
                                            Tidak ada senjata tersedia
                                        </div>
                                    ) : (
                                        weapons.map((weapon) => (
                                            <SelectItem
                                                key={weapon.id}
                                                value={String(weapon.id)}
                                            >
                                                {weapon.serial_number} -{' '}
                                                {weapon.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.weapon_id && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.weapon_id}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className='space-y-2'>
                                <Label htmlFor="issue_date">
                                    Tanggal Penerbitan{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="issue_date"
                                    type="date"
                                    value={data.issue_date}
                                    onChange={(e) =>
                                        setData('issue_date', e.target.value)
                                    }
                                />
                                {errors.issue_date && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.issue_date}
                                    </p>
                                )}
                            </div>

                           <div className='space-y-2'>
                                <Label htmlFor="expiry_date">
                                    Tanggal Kadaluarsa{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) =>
                                        setData('expiry_date', e.target.value)
                                    }
                                />
                                {errors.expiry_date && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {errors.expiry_date}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Menerbitkan...'
                                : 'Terbitkan Kartu Pengpin'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
