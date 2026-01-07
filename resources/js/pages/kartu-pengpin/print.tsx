import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface KartuPengpin {
    id: number;
    card_number: string;
    permit_id: number;
    person_id: number;
    weapon_id: number;
    issued_at: string;
    expired_at: string;
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
}

const KartuPengpinPrintPage = () => {
    const page = usePage<{ kartu: KartuPengpin }>();
    const { kartu } = page.props;

    useEffect(() => {
        // Auto-print when page loads
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={`Cetak Kartu Pengpin ${kartu.card_number}`} />

            <div className="min-h-screen bg-white p-8 print:p-0">
                <style>{`
                    @media print {
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                `}</style>

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center border-b-4 border-gray-800 pb-6 mb-8">
                        <div className="text-2xl font-bold mb-2">KEPOLISIAN NEGARA REPUBLIK INDONESIA</div>
                        <div className="text-xl font-semibold mb-2">DAERAH JAWA TIMUR</div>
                        <div className="text-lg font-semibold">DIREKTORAT INTELIJEN KEAMANAN</div>
                        <div className="text-sm mt-2">
                            Jl. Ahmad Yani No. 116, Surabaya, Jawa Timur 60235
                        </div>
                    </div>

                    {/* Card Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            KARTU PENGAWASAN & PENGENDALIAN
                        </h1>
                        <h2 className="text-2xl font-bold mb-4">SENJATA API</h2>
                        <div className="inline-block bg-gray-200 px-6 py-2 rounded">
                            <span className="text-xl font-mono font-bold">{kartu.card_number}</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Personal Information */}
                        <div className="border-2 border-gray-800 p-6">
                            <h3 className="text-xl font-bold mb-4 border-b-2 border-gray-600 pb-2">
                                IDENTITAS PEMEGANG IZIN
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Nama Lengkap</div>
                                    <div className="font-medium text-lg">{kartu.person.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">NIK</div>
                                    <div className="font-medium text-lg font-mono">{kartu.person.nik}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Tanggal Lahir</div>
                                    <div className="font-medium">
                                        {new Date(kartu.person.date_of_birth).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Telepon</div>
                                    <div className="font-medium">{kartu.person.phone}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-sm font-semibold text-gray-600">Alamat</div>
                                    <div className="font-medium">{kartu.person.address}</div>
                                </div>
                            </div>
                        </div>

                        {/* Weapon Information */}
                        <div className="border-2 border-gray-800 p-6">
                            <h3 className="text-xl font-bold mb-4 border-b-2 border-gray-600 pb-2">
                                DATA SENJATA API
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Nomor Seri</div>
                                    <div className="font-medium text-lg font-mono">{kartu.weapon.serial_number}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Merek</div>
                                    <div className="font-medium text-lg">{kartu.weapon.brand}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Model</div>
                                    <div className="font-medium">{kartu.weapon.model}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Jenis</div>
                                    <div className="font-medium">{kartu.weapon.weapon_type}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Kaliber</div>
                                    <div className="font-medium">{kartu.weapon.caliber}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Tahun Produksi</div>
                                    <div className="font-medium">{kartu.weapon.year_of_manufacture}</div>
                                </div>
                            </div>
                        </div>

                        {/* Permit Information */}
                        <div className="border-2 border-gray-800 p-6">
                            <h3 className="text-xl font-bold mb-4 border-b-2 border-gray-600 pb-2">
                                INFORMASI IZIN
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Nomor Izin</div>
                                    <div className="font-medium text-lg font-mono">{kartu.permit.permit_number}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Jenis Izin</div>
                                    <div className="font-medium">{kartu.permit.permit_type_label}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Tanggal Terbit</div>
                                    <div className="font-medium">
                                        {new Date(kartu.issued_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-600">Berlaku Sampai</div>
                                    <div className="font-medium">
                                        {new Date(kartu.expired_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-12 flex justify-between items-end">
                            <div className="w-1/3">
                                {/* QR Code placeholder - could be implemented with a QR library */}
                                <div className="border-2 border-gray-400 w-32 h-32 flex items-center justify-center text-gray-400 text-xs">
                                    QR Code
                                </div>
                            </div>
                            
                            <div className="w-1/3 text-center">
                                <div className="mb-16">Surabaya, {new Date().toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}</div>
                                <div className="border-t-2 border-gray-800 pt-2">
                                    <div className="font-bold">KEPALA DIREKTORAT</div>
                                    <div className="font-bold">INTELIJEN KEAMANAN</div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div className="mt-8 p-4 bg-gray-100 border-l-4 border-gray-800">
                            <p className="text-sm font-semibold mb-2">PENTING:</p>
                            <ol className="text-xs space-y-1 list-decimal list-inside">
                                <li>Kartu ini harus selalu dibawa bersama senjata api</li>
                                <li>Kartu yang hilang atau rusak harus segera dilaporkan</li>
                                <li>Kartu ini tidak dapat dipindahtangankan</li>
                                <li>Kepemilikan senjata api wajib dilaporkan setiap 6 bulan sekali</li>
                                <li>Kartu yang sudah tidak berlaku harus dikembalikan</li>
                            </ol>
                        </div>
                    </div>

                    {/* Print Button (hidden on print) */}
                    <div className="mt-8 text-center print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Cetak Kartu
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KartuPengpinPrintPage;
