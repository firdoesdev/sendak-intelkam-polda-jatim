<?php

namespace App\Actions\Permits;

use App\Models\Permit;
use App\Models\PermitDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UploadPermitDocument
{
    public function execute(Permit $permit, string $documentType, UploadedFile $file): PermitDocument
    {
        // Validate file size (max 2MB)
        if ($file->getSize() > 2 * 1024 * 1024) {
            throw new \InvalidArgumentException('File size exceeds 2MB limit');
        }

        // Generate unique filename
        $filename = uniqid() . '_' . $file->getClientOriginalName();
        
        // Store in private permits disk
        $path = $file->storeAs(
            "permit_{$permit->id}/{$documentType}",
            $filename,
            'permits'
        );

        return PermitDocument::create([
            'permit_id' => $permit->id,
            'document_type' => $documentType,
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'original_filename' => $file->getClientOriginalName(),
            'uploaded_by' => Auth::id(),
        ]);
    }

    public function delete(PermitDocument $document): void
    {
        // Delete physical file
        Storage::disk('permits')->delete($document->file_path);
        
        // Delete database record
        $document->delete();
    }
}
