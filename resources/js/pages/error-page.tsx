import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
    status: number;
}

const messages: Record<number, { title: string; description: string }> = {
    403: {
        title: '403: Akses Ditolak',
        description: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
    },
    404: {
        title: '404: Halaman Tidak Ditemukan',
        description: 'Maaf, halaman yang Anda cari tidak dapat ditemukan.',
    },
    500: {
        title: '500: Terjadi Kesalahan',
        description: 'Maaf, terjadi kesalahan pada server kami.',
    },
    503: {
        title: '503: Layanan Tidak Tersedia',
        description: 'Maaf, kami sedang melakukan pemeliharaan. Silakan coba beberapa saat lagi.',
    },
};

export default function ErrorPage({ status }: ErrorPageProps) {
    const { title, description } = messages[status] ?? {
        title: 'Terjadi Kesalahan',
        description: 'Maaf, terjadi kesalahan yang tidak terduga.',
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
            <Head title={title} />
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
                <p className="max-w-md text-muted-foreground">{description}</p>
            </div>
            <Button asChild>
                <Link href="/">Kembali ke Beranda</Link>
            </Button>
        </div>
    );
}
