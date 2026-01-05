import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import hibahTransfers from '@/routes/weapons/hibah-transfers';
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

interface WeaponHibahTransfer {
    id: number;
    weapon_id: number;
    from_person_id: number;
    from_permit_id: number;
    to_person_id: number;
    to_permit_id: number | null;
    transfer_reason: string;
    status: string;
    status_label: string;
    status_variant: string;
    submitted_at: string | null;
    approved_at: string | null;
    approved_by: number | null;
    approval_notes: string | null;
    created_at: string;
    updated_at: string;
    weapon: {
        id: number;
        serial_number: string;
        brand: string;
        model: string;
        caliber: string;
        weapon_type: string;
    };
    from_person: {
        id: number;
        name: string;
        nik: string;
        address: string;
    };
    to_person: {
        id: number;
        name: string;
        nik: string;
        address: string;
    };
    from_permit: {
        id: number;
        permit_number: string;
        permit_type: string;
    };
    to_permit: {
        id: number;
        permit_number: string;
        permit_type: string;
    } | null;
    approver?: {
        id: number;
        name: string;
    };
}

const HibahTransferShowPage = () => {
    const page = usePage<{ transfer: WeaponHibahTransfer }>();
    const { transfer } = page.props;
    
    const [approveDialog, setApproveDialog] = useState(false);
    const [rejectDialog, setRejectDialog] = useState(false);
    const [notes, setNotes] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Senjata',
            href: '/weapons',
        },
        {
            title: 'Transfer Hibah',
            href: '/weapons/hibah-transfers',
        },
        {
            title: `Transfer #${transfer.id}`,
            href: `/weapons/hibah-transfers/${transfer.id}`,
        },
    ];

    const handleApprove = () => {
        router.post(hibahTransfers.approve(transfer.id).url, {
            action: 'approve',
            notes,
        }, {
            preserveState: true,
            onSuccess: () => {
                setApproveDialog(false);
                setNotes('');
                toast.success('Transfer hibah berhasil disetujui');
            },
            onError: () => {
                toast.error('Gagal menyetujui transfer hibah');
            },
        });
    };

    const handleReject = () => {
        router.post(hibahTransfers.approve(transfer.id).url, {
            action: 'reject',
            notes,
        }, {
            preserveState: true,
            onSuccess: () => {
                setRejectDialog(false);
                setNotes('');
                toast.success('Transfer hibah berhasil ditolak');
            },
            onError: () => {
                toast.error('Gagal menolak transfer hibah');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transfer Hibah #${transfer.id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Transfer Hibah #{transfer.id}</h1>
                        <p className="text-muted-foreground">
                            Dibuat pada {new Date(transfer.created_at).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <Badge variant={transfer.status_variant as any} className="text-lg px-4 py-2">
                        {transfer.status_label}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Senjata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Nomor Seri</div>
                                <div className="font-medium">{transfer.weapon.serial_number}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Merek & Model</div>
                                <div className="font-medium">{transfer.weapon.brand} {transfer.weapon.model}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Kaliber</div>
                                <div className="font-medium">{transfer.weapon.caliber}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Jenis</div>
                                <div className="font-medium">{transfer.weapon.weapon_type}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Alasan Transfer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{transfer.transfer_reason}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dari (Pemberi Hibah)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Nama</div>
                                <div className="font-medium">{transfer.from_person.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">NIK</div>
                                <div className="font-medium">{transfer.from_person.nik}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Alamat</div>
                                <div className="font-medium">{transfer.from_person.address}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Nomor Izin</div>
                                <div className="font-medium">{transfer.from_permit.permit_number}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kepada (Penerima Hibah)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Nama</div>
                                <div className="font-medium">{transfer.to_person.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">NIK</div>
                                <div className="font-medium">{transfer.to_person.nik}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Alamat</div>
                                <div className="font-medium">{transfer.to_person.address}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Nomor Izin</div>
                                <div className="font-medium">
                                    {transfer.to_permit?.permit_number || 'Belum memiliki izin'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {transfer.status === 'pending' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tindakan</CardTitle>
                            <CardDescription>
                                Setujui atau tolak transfer hibah ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button
                                variant="default"
                                onClick={() => setApproveDialog(true)}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Setujui Transfer
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setRejectDialog(true)}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Tolak Transfer
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {transfer.status === 'approved' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Persetujuan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Disetujui Oleh</div>
                                <div className="font-medium">{transfer.approver?.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Tanggal Persetujuan</div>
                                <div className="font-medium">
                                    {transfer.approved_at && new Date(transfer.approved_at).toLocaleString('id-ID')}
                                </div>
                            </div>
                            {transfer.approval_notes && (
                                <div>
                                    <div className="text-sm text-muted-foreground">Catatan</div>
                                    <div className="font-medium">{transfer.approval_notes}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {transfer.status === 'rejected' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Penolakan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Ditolak Oleh</div>
                                <div className="font-medium">{transfer.approver?.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Tanggal Penolakan</div>
                                <div className="font-medium">
                                    {transfer.approved_at && new Date(transfer.approved_at).toLocaleString('id-ID')}
                                </div>
                            </div>
                            {transfer.approval_notes && (
                                <div>
                                    <div className="text-sm text-muted-foreground">Alasan Penolakan</div>
                                    <div className="font-medium">{transfer.approval_notes}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <AlertDialog open={approveDialog} onOpenChange={setApproveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Setujui Transfer Hibah</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menyetujui transfer hibah ini? 
                            Senjata akan dipindahkan kepemilikannya.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="approve-notes">Catatan (Opsional)</Label>
                        <Textarea
                            id="approve-notes"
                            placeholder="Tambahkan catatan persetujuan..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNotes('')}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApprove}>
                            Ya, Setujui
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={rejectDialog} onOpenChange={setRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak Transfer Hibah</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menolak transfer hibah ini? 
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="reject-notes">Alasan Penolakan (Wajib)</Label>
                        <Textarea
                            id="reject-notes"
                            placeholder="Masukkan alasan penolakan..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            required
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNotes('')}>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleReject}
                            disabled={!notes.trim()}
                        >
                            Ya, Tolak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default HibahTransferShowPage;
