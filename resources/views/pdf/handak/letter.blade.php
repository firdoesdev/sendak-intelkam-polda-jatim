<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Rekomendasi {{ $permit->recommendation_type }}</title>
    <style>
        @page { margin: 2cm 2.5cm; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; line-height: 1.4; }
        .letterhead { width: 45%; text-align: center; border-bottom: 2px solid #000; padding-bottom: 4px; }
        .letterhead .line1 { font-weight: bold; font-size: 11pt; }
        .letterhead .line2 { font-weight: bold; font-size: 11pt; }
        .letterhead .line3 { font-size: 9pt; }
        table.meta { margin-top: 16px; font-size: 12pt; }
        table.meta td { vertical-align: top; padding: 0 4px 2px 0; }
        .recipient { margin-top: 8px; text-align: right; width: 40%; float: right; }
        .content { clear: both; margin-top: 24px; }
        ol.rujukan { margin: 4px 0 12px 24px; padding: 0; }
        ol.rujukan li { margin-bottom: 6px; text-align: justify; }
        table.detail td { vertical-align: top; padding: 1px 4px 1px 0; }
        table.materials { margin: 8px 0 8px 24px; }
        table.materials td { padding: 1px 8px 1px 0; }
        .signature { margin-top: 32px; width: 50%; float: right; text-align: center; }
        .signature .name { margin-top: 64px; font-weight: bold; text-decoration: underline; }
        .tembusan { clear: both; padding-top: 24px; font-size: 11pt; }
        p.justify { text-align: justify; }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="line1">{{ config('handak.letterhead.line1') }}</div>
        <div class="line2">{{ config('handak.letterhead.line2') }}</div>
        <div class="line3">{{ config('handak.letterhead.line3') }}</div>
    </div>

    <div class="recipient">
        {{ config('handak.letterhead.city') }}, {{ now()->translatedFormat('d F Y') }}
        <br><br>
        Kepada<br>
        Yth. <strong>KEPALA KEPOLISIAN NEGARA<br>REPUBLIK INDONESIA</strong><br>
        di<br>
        Jakarta<br><br>
        u.p. Kabaintelkam
    </div>

    <table class="meta">
        <tr><td>Nomor</td><td>:</td><td>{{ $permit->permit_number ?? 'R/        /'.now()->format('Y') }}</td></tr>
        <tr><td>Klasifikasi</td><td>:</td><td>Rahasia</td></tr>
        <tr><td>Lampiran</td><td>:</td><td>-</td></tr>
        @php
            $halRekom = match ($permit->recommendation_type) {
                'P1' => 'rekomendasi izin penggunaan sisa bahan peledak',
                'P2' => 'rekomendasi izin pembelian dan penggunaan bahan peledak',
                'P3' => 'rekomendasi izin penggunaan bahan peledak',
                'IJIN_GUDANG' => 'rekomendasi izin pemilikan, penguasaan dan penyimpanan bahan peledak',
                default => 'rekomendasi izin bahan peledak',
            };
        @endphp
        <tr>
            <td>Hal</td><td>:</td>
            <td>
                {{ $halRekom }}
                a.n. {{ $permit->applicant?->organization?->name ?? $permit->applicant?->display_name }}.
            </td>
        </tr>
    </table>

    <div class="content">
        <p>1. Rujukan:</p>
        <ol class="rujukan" type="a">
            <li>Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 17 Tahun 2017 tentang Perizinan, Pengamanan, Pengawasan dan Pengendalian Bahan Peledak Komersial;</li>
            @foreach ($permit->handakReferences as $reference)
                <li>
                    {{ \App\Enums\HandakReferenceType::tryFrom($reference->reference_type)?->label() ?? $reference->reference_type }}
                    Nomor: {{ $reference->document_number }}@if($reference->document_date), tanggal {{ $reference->document_date->translatedFormat('d F Y') }}@endif
                    @if($reference->issuer) dari {{ $reference->issuer }}@endif;
                </li>
            @endforeach
        </ol>

        @php
            $purposeClause = '';
            if ($permit->purpose) {
                $purposeClause .= ', guna untuk menunjang '.$permit->purpose;
            }
            if ($permit->activity_location) {
                $purposeClause .= ' di '.$permit->activity_location;
            }
        @endphp
        <p class="justify">
            2. Sehubungan dengan permohonan di atas, telah dilengkapi persyaratan sesuai ketentuan yang
            berlaku{{ $purposeClause }}, mohon pertimbangan kiranya kepada:
        </p>

        <table class="detail" style="margin-left: 24px;">
            <tr><td>nama</td><td>:</td><td>{{ $permit->representative_name }};</td></tr>
            <tr><td>warga negara</td><td>:</td><td>{{ $permit->representative_nationality ?? 'Indonesia' }};</td></tr>
            <tr><td>jabatan</td><td>:</td><td>{{ $permit->representative_title }};</td></tr>
            <tr><td>nama instansi</td><td>:</td><td>{{ $permit->applicant?->organization?->name }};</td></tr>
            <tr><td>alamat</td><td>:</td><td>{{ $permit->applicant?->organization?->address }}.</td></tr>
        </table>

        <p class="justify" style="margin-top: 12px;">
            3. Adapun jumlah dan jenis bahan peledak yang dimintakan izin
            @if($permit->parentPermit?->si_number)
                berasal dari Surat Izin Nomor: {{ $permit->parentPermit->si_number }}
            @endif
            adalah:
        </p>

        <table class="materials">
            @foreach ($permit->explosivesMaterials as $material)
                <tr>
                    <td>{{ $material->material_type }}</td>
                    <td>:</td>
                    <td>{{ number_format($material->total_weight, 0, ',', '.') }} {{ ucfirst($material->unit) }};</td>
                </tr>
            @endforeach
        </table>

        @if ($permit->warehouse)
            <p class="justify">
                4. Lokasi gudang handak {{ $permit->applicant?->organization?->name }} yang berada di
                {{ collect([$permit->warehouse->address, $permit->warehouse->village, $permit->warehouse->city, $permit->warehouse->province])->filter()->join(', ') }}.
            </p>
        @endif

        <p class="justify">
            5. Demikian untuk menjadi maklum, atas perhatian dan kerja samanya diucapkan terima kasih.
        </p>
    </div>

    <div class="signature">
        a.n. KEPALA KEPOLISIAN DAERAH JAWA TIMUR<br>
        {{ config('handak.signatory.position') }}
        <div class="name">{{ config('handak.signatory.name') ?: '..........................' }}</div>
        <div>{{ config('handak.signatory.rank') }} @if(config('handak.signatory.nrp'))NRP {{ config('handak.signatory.nrp') }}@endif</div>
    </div>

    <div class="tembusan">
        Tembusan:
        <ol style="margin: 4px 0 0 16px; padding: 0;">
            @foreach (config('handak.tembusan') as $tembusan)
                <li>{{ $tembusan }}</li>
            @endforeach
        </ol>
    </div>
</body>
</html>
