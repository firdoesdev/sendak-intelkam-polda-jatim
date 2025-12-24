<?php

use App\Http\Controllers\Permits\PermitController;
use App\Http\Controllers\Permits\PermitRenewalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/permits', PermitController::class)->names('permits');
    
    // Permit Renewals
    Route::get('/permits/renewals', [PermitRenewalController::class, 'index'])->name('permits.renewals.index');
    Route::post('/permits/renewals', [PermitRenewalController::class, 'store'])->name('permits.renewals.store');
    Route::post('/permits/renewals/{id}/approve', [PermitRenewalController::class, 'approve'])->name('permits.renewals.approve');
    Route::post('/permits/renewals/{id}/reject', [PermitRenewalController::class, 'reject'])->name('permits.renewals.reject');
});
