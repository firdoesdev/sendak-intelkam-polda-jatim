<?php

namespace App\Http\Controllers\Handak;

use App\Enums\PermitType;
use App\Http\Controllers\Controller;
use App\Models\Permit;
use Barryvdh\DomPDF\Facade\Pdf;
use Gate;

class HandakLetterController extends Controller
{
    public function show(Permit $permit)
    {
        Gate::authorize('print-handak-letter');

        abort_unless($permit->permit_type === PermitType::HANDAK->value, 404);

        $permit->load([
            'applicant.organization',
            'parentPermit',
            'warehouse',
            'explosivesMaterials',
            'handakReferences',
        ]);

        // TODO(reference-doc): template surat P2/P3/Ijin Gudang menunggu contoh dari team handak;
        // sementara semua jenis rekom memakai layout surat contoh P1.
        $pdf = Pdf::loadView('pdf.handak.letter', [
            'permit' => $permit,
        ])->setPaper('a4');

        $filename = sprintf('rekom-%s-%s.pdf', strtolower((string) $permit->recommendation_type), $permit->permit_number ?? $permit->id);

        return $pdf->stream($filename);
    }
}
