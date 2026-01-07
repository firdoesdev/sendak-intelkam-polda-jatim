<?php

use App\Http\Controllers\KartuPengpinController;
use App\Http\Controllers\PermitDocumentController;
use App\Http\Controllers\Permits\PermitController;
use App\Http\Controllers\Permits\PermitRenewalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Permit Renewals
    Route::get('/renewals-permits', [PermitRenewalController::class, 'index'])->name('permits.renewals.index');
    Route::post('/renewals-permits', [PermitRenewalController::class, 'store'])->name('permits.renewals.store');
    Route::post('/renewals-permits/{id}/approve', [PermitRenewalController::class, 'approve'])->name('permits.renewals.approve');
    Route::post('/renewals-permits/{id}/reject', [PermitRenewalController::class, 'reject'])->name('permits.renewals.reject');

    Route::resource('/permits', PermitController::class)->names('permits');

    // Permit Documents
    Route::prefix('/permits/{permit}/documents')->name('permits.documents.')->group(function () {
        Route::post('/', [PermitDocumentController::class, 'store'])->name('store');
    });
    Route::get('/documents/{document}/download', [PermitDocumentController::class, 'download'])->name('documents.download');
    Route::delete('/documents/{document}', [PermitDocumentController::class, 'destroy'])->name('documents.destroy');

    // Kartu Pengpin (POLSUS)
    Route::prefix('/kartu-pengpin')->name('kartu-pengpin.')->group(function () {
        Route::get('/', [KartuPengpinController::class, 'index'])->name('index');
        Route::post('/', [KartuPengpinController::class, 'store'])->name('store');
        Route::get('/{kartuPengpin}', [KartuPengpinController::class, 'show'])->name('show');
        Route::get('/{kartuPengpin}/print', [KartuPengpinController::class, 'print'])->name('print');
        Route::post('/{kartuPengpin}/revoke', [KartuPengpinController::class, 'revoke'])->name('revoke');
    });
});
