<?php

namespace App\Http\Controllers;

use App\Actions\Permits\UploadPermitDocument;
use App\Http\Requests\PermitDocumentRequest;
use App\Models\Permit;
use App\Models\PermitDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PermitDocumentController extends Controller
{
    public function __construct(
        private UploadPermitDocument $uploadPermitDocument
    ) {}

    public function store(Permit $permit, PermitDocumentRequest $request)
    {
        try {
            $document = $this->uploadPermitDocument->execute(
                permit: $permit,
                documentType: $request->input('document_type'),
                file: $request->file('document')
            );

            return back()->with('success', 'Dokumen berhasil diunggah');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['document' => $e->getMessage()]);
        }
    }

    public function download(PermitDocument $document)
    {
        if (!Storage::disk('permits')->exists($document->file_path)) {
            abort(404, 'File tidak ditemukan');
        }

        return Storage::disk('permits')->download(
            $document->file_path,
            $document->original_filename
        );
    }

    public function destroy(PermitDocument $document)
    {
        try {
            $this->uploadPermitDocument->delete($document);

            return back()->with('success', 'Dokumen berhasil dihapus');
        } catch (\Exception $e) {
            return back()->withErrors(['document' => 'Gagal menghapus dokumen']);
        }
    }
}
