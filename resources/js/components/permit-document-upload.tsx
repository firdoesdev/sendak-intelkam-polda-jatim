import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, Download, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PermitDocument {
    id: number;
    permit_id: number;
    document_type: string;
    document_type_label: string;
    file_name: string;
    file_path: string;
    file_size: number;
    uploaded_at: string;
}

interface PermitDocumentUploadProps {
    permitId: number;
    documents: PermitDocument[];
    allowedTypes?: string[];
    maxSize?: number; // in MB
    onUploadSuccess?: () => void;
}

const DOCUMENT_TYPES = [
    { value: 'ktp', label: 'KTP' },
    { value: 'kk', label: 'Kartu Keluarga' },
    { value: 'skck', label: 'SKCK' },
    { value: 'medical_certificate', label: 'Surat Keterangan Sehat' },
    { value: 'psychological_test', label: 'Hasil Tes Psikologi' },
    { value: 'recommendation_letter', label: 'Surat Rekomendasi' },
    { value: 'weapon_ownership_proof', label: 'Bukti Kepemilikan Senjata' },
    { value: 'other', label: 'Lainnya' },
];

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const PermitDocumentUpload = ({
    permitId,
    documents,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize = 2, // 2MB default
    onUploadSuccess,
}: PermitDocumentUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`Ukuran file tidak boleh lebih dari ${maxSize}MB`);
            return;
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            toast.error('Tipe file tidak didukung. Gunakan PDF, JPG, atau PNG');
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedType) {
            toast.error('Pilih jenis dokumen dan file terlebih dahulu');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('document_type', selectedType);

        router.post(`/permits/${permitId}/documents`, formData, {
            preserveState: true,
            onSuccess: () => {
                toast.success('Dokumen berhasil diunggah');
                setSelectedFile(null);
                setSelectedType('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                onUploadSuccess?.();
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ');
                toast.error(errorMessage || 'Gagal mengunggah dokumen');
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const handleDownload = (documentId: number) => {
        window.open(`/documents/${documentId}/download`, '_blank');
    };

    const handleDelete = (documentId: number) => {
        router.delete(`/documents/${documentId}`, {
            preserveState: true,
            onSuccess: () => {
                toast.success('Dokumen berhasil dihapus');
                setDeleteDialog(null);
                onUploadSuccess?.();
            },
            onError: () => {
                toast.error('Gagal menghapus dokumen');
            },
        });
    };

    return (
        <div className="space-y-4">
            {/* Upload Section */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="document_type">Jenis Dokumen</Label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger id="document_type">
                                        <SelectValue placeholder="Pilih jenis dokumen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DOCUMENT_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="document_file">File Dokumen</Label>
                                <div className="flex gap-2">
                                    <input
                                        ref={fileInputRef}
                                        id="document_file"
                                        type="file"
                                        accept={allowedTypes.join(',')}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {selectedFile ? selectedFile.name : 'Pilih File'}
                                    </Button>
                                    {selectedFile && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {selectedFile && (
                                    <p className="text-sm text-muted-foreground">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                                File maksimal {maxSize}MB. Format: PDF, JPG, PNG
                            </span>
                        </div>

                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={!selectedFile || !selectedType || uploading}
                        >
                            {uploading ? 'Mengunggah...' : 'Unggah Dokumen'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Documents List */}
            {documents.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Dokumen yang Diunggah</h3>
                        <div className="space-y-2">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <File className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{doc.file_name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                <Badge variant="secondary" className="mr-2">
                                                    {doc.document_type_label}
                                                </Badge>
                                                {formatFileSize(doc.file_size)} • {' '}
                                                {new Date(doc.uploaded_at).toLocaleDateString('id-ID')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownload(doc.id)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteDialog(doc.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Dokumen</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus dokumen ini? 
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteDialog && handleDelete(deleteDialog)}
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PermitDocumentUpload;
