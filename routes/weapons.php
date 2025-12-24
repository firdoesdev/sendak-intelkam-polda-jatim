<?php

use App\Http\Controllers\Weapons\WeaponController;
use App\Http\Controllers\Weapons\WeaponTransferController;
use App\Http\Controllers\Permits\PermitRenewalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Weapon Management
    Route::resource('/weapons', WeaponController::class)
        ->names('weapons');
    
    // Weapon Transfer Requests
    Route::prefix('/weapons/transfer-requests')->name('weapons.transfer-requests.')->group(function () {
        Route::get('/', [WeaponTransferController::class, 'index'])->name('index');
        Route::post('/', [WeaponTransferController::class, 'store'])->name('store');
        Route::post('/{id}/approve', [WeaponTransferController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [WeaponTransferController::class, 'reject'])->name('reject');
    });
    
    // Permit Renewals
    Route::prefix('/permits/renewals')->name('permits.renewals.')->group(function () {
        Route::get('/', [PermitRenewalController::class, 'index'])->name('index');
        Route::post('/', [PermitRenewalController::class, 'store'])->name('store');
        Route::post('/{id}/approve', [PermitRenewalController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [PermitRenewalController::class, 'reject'])->name('reject');
    });
});
