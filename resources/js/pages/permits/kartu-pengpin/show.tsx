import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface KartuPengpin {
    id: number;
    card_number: string;
    permit_id: number;
    person_id: number;
    weapon_id: number;
    issued_at: string;
    expired_at: string;
    status: string;
    status_label: string;
    status_variant: string;
    revoked_at: string | null;
    revoked_by: number | null;
    revoke_reason: string | null;
    created_at: string;
    updated_at: string;
    permit: {
        id: number;
        permit_number: string;
        permit_type: string;
        permit_type_label: string;
    };
    person: {
        id: number;
        name: string;
        nik: string;
        date_of_birth: string;
        address: string;
        phone: string;
    };
    weapon: {
        id: number;
        serial_number: string;
        brand: string;
        model: string;
        caliber: string;
        weapon_type: string;
        year_of_manufacture: number;
    };
    revoker?: {
        id: number;
        name: string;
    };
}

const isExpired = (expiredAt: string) => {
    return new Date(expiredAt) < new Date();
};

const KartuPengpinShowPage = () => {
    const page = usePage<{ kartu: KartuPengpin }>();
    const { kartu } = page.props;
    
    const [revokeDialog, setRevokeDialog] = useState(false);
    const [revokeReason, setRevokeReason] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Izin',
            href: '/permits',
        },
        {
            title: 'Kartu Pengpin',
            href: '/kartu-pengpin',
        },
        {
            title: kartu.card_number,
            href: `/kartu-pengpin/${kartu.id}`,
        },
    ];

    const handleRevoke = () => {
        router.post(`/kartu-pengpin/${kartu.id}/revoke`, {
            revoke_reason: revokeReason,
        }, {
            preserveState: true,
            onSuccess: () => {
                setRevokeDialog(false);
                setRevokeReason('');
                toast.success('Kartu pengpin berhasil dicabut');
            },
            onError: () => {
                toast.error('Gagal mencabut kartu pengpin');
            },
        });
    };

    const handlePrint = () => {
        window.open(`/kartu-pengpin/${kartu.id}/print`, '_blank');
    };

    const expired = isExpired(kartu.expired_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kartu Pengpin ${kartu.card_number}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-mono">{kartu.card_number}</h1>
                        <p className="text-muted-foreground">
                            Diterbitkan pada {new Date(kartu.issued_at).toLocaleDateString('id-ID')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={kartu.status_variant as any} className="text-lg px-4 py-2">
                            {kartu.status_label}
                        </Badge>
                        {expired && (
                            <Badge variant="destructive" className="text-lg px-4 py-2">
                                Kadaluarsa
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pemilik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Nama Lengkap</div>
                                <div className="font-medium">{kartu.person.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">NIK</div>
                                <div className="font-medium">{kartu.person.nik}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Tanggal Lahir</div>
                                <div className="font-medium">
                                    {new Date(kartu.person.date_of_birth).toLocaleDateString('id-ID')}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Alamat</div>
                                <div className="font-medium">{kartu.person.address}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Telepon</div>
                                <div className="font-medium">{kartu.person.phone}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Senjata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Nomor Seri</div>
                                <div className="font-medium font-mono">{kartu.weapon.serial_number}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Merek & Model</div>
                                <div className="font-medium">{kartu.weapon.brand} {kartu.weapon.model}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Jenis</div>
                                <div className="font-medium">{kartu.weapon.weapon_type}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Kaliber</div>
                                <div className="font-medium">{kartu.weapon.caliber}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Tahun Produksi</div>
                                <div className="font-medium">{kartu.weapon.year_of_manufacture}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Izin</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Nomor Izin</div>
                                <div className="font-medium font-mono">{kartu.permit.permit_number}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Jenis Izin</div>
                                <div className="font-medium">{kartu.permit.permit_type_label}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Masa Berlaku</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Tanggal Terbit</div>
                                <div className="font-medium">
                                    {new Date(kartu.issued_at).toLocaleDateString('id-ID')}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Tanggal Kadaluarsa</div>
                                <div className="font-medium">
                                    {new Date(kartu.expired_at).toLocaleDateString('id-ID')}
                                </div>
                            </div>
                            {expired && (
                                <div className="pt-2">
                                    <Badge variant="destructive">
                                        Kartu ini sudah kadaluarsa
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {kartu.status === 'active' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tindakan</CardTitle>
                            <CardDescription>
                                Cetak atau cabut kartu pengpin ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button
                                variant="default"
                                onClick={handlePrint}
                            >
                                <Printer className="h-4 w-4 mr-2" />
                                Cetak Kartu
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setRevokeDialog(true)}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cabut Kartu
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {kartu.status === 'revoked' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pencabutan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Dicabut Oleh</div>
                                <div className="font-medium">{kartu.revoker?.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Tanggal Pencabutan</div>
                                <div className="font-medium">
                                    {kartu.revoked_at && new Date(kartu.revoked_at).toLocaleString('id-ID')}
                                </div>
                            </div>
                            {kartu.revoke_reason && (
                                <div>
                                    <div className="text-sm text-muted-foreground">Alasan Pencabutan</div>
                                    <div className="font-medium">{kartu.revoke_reason}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <AlertDialog open={revokeDialog} onOpenChange={setRevokeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cabut Kartu Pengpin</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mencabut kartu pengpin ini? 
                            Kartu yang sudah dicabut tidak dapat diaktifkan kembali.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="revoke-reason">Alasan Pencabutan (Wajib)</Label>
                        <Textarea
                            id="revoke-reason"
                            placeholder="Masukkan alasan pencabutan..."
                            value={revokeReason}
                            onChange={(e) => setRevokeReason(e.target.value)}
                            rows={3}
                            required
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRevokeReason('')}>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleRevoke}
                            disabled={!revokeReason.trim()}
                        >
                            Ya, Cabut Kartu
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default KartuPengpinShowPage;
