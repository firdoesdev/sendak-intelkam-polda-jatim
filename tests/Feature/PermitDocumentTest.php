<?php

use App\Models\Permit;
use App\Models\PermitDocument;
use App\Models\User;
use App\Models\Applicant;
use App\Models\Division;
use App\Enums\DocumentType;

test('permit can have multiple documents', function () {
    $user = User::factory()->create();
    $division = Division::factory()->create();
    $applicant = Applicant::factory()->create();

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
    ]);

    PermitDocument::create([
        'permit_id' => $permit->id,
        'document_type' => DocumentType::KTP->value,
        'file_path' => 'permits/ktp_12345.pdf',
        'file_size' => 1024000, // 1MB
        'mime_type' => 'application/pdf',
        'original_filename' => 'KTP.pdf',
        'uploaded_by' => $user->id,
    ]);

    PermitDocument::create([
        'permit_id' => $permit->id,
        'document_type' => DocumentType::NPWP->value,
        'file_path' => 'permits/npwp_12345.pdf',
        'file_size' => 512000, // 0.5MB
        'mime_type' => 'application/pdf',
        'original_filename' => 'NPWP.pdf',
        'uploaded_by' => $user->id,
    ]);

    expect($permit->documents()->count())->toBe(2);
});

test('permit document calculates file size in MB correctly', function () {
    $user = User::factory()->create();
    $division = Division::factory()->create();
    $applicant = Applicant::factory()->create();

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
    ]);

    $document = PermitDocument::create([
        'permit_id' => $permit->id,
        'document_type' => DocumentType::KTP->value,
        'file_path' => 'permits/ktp_12345.pdf',
        'file_size' => 2097152, // 2MB in bytes
        'mime_type' => 'application/pdf',
        'original_filename' => 'KTP.pdf',
        'uploaded_by' => $user->id,
    ]);

    expect($document->file_size_in_mb)->toBe(2.0);
});

test('document types have proper labels', function () {
    expect(DocumentType::KTP->label())->toBe('KTP');
    expect(DocumentType::NPWP->label())->toBe('NPWP');
    expect(DocumentType::KSK->label())->toBe('Keterangan Sehat Kelakuan');
    expect(DocumentType::IMPORT_PERMIT->label())->toBe('Surat Ijin Impor');
    expect(DocumentType::HEALTH_TEST->label())->toBe('Hasil Tes Kesehatan');
    expect(DocumentType::PSYCH_TEST->label())->toBe('Hasil Tes Psikologi');
    expect(DocumentType::SHOOTING_TEST->label())->toBe('Hasil Tes Menembak');
    expect(DocumentType::SURAT_HIBAH->label())->toBe('Surat Hibah');
});

test('permit document belongs to uploader', function () {
    $user = User::factory()->create();
    $division = Division::factory()->create();
    $applicant = Applicant::factory()->create();

    $permit = Permit::factory()->create([
        'division_id' => $division->id,
        'applicant_id' => $applicant->id,
    ]);

    $document = PermitDocument::create([
        'permit_id' => $permit->id,
        'document_type' => DocumentType::KTP->value,
        'file_path' => 'permits/ktp_12345.pdf',
        'file_size' => 1024000,
        'mime_type' => 'application/pdf',
        'original_filename' => 'KTP.pdf',
        'uploaded_by' => $user->id,
    ]);

    expect($document->uploader->id)->toBe($user->id);
    expect($document->uploader->email)->toBe($user->email);
});
