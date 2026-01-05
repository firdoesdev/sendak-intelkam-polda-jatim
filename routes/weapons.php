<?php

use App\Http\Controllers\WeaponHibahTransferController;
use App\Http\Controllers\Weapons\WeaponController;
use App\Http\Controllers\Weapons\WeaponTransferController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
  
    // Weapon Transfer Requests
    Route::prefix('/weapons/transfer-requests')->name('weapons.transfer-requests.')->group(function () {
        Route::get('/', [WeaponTransferController::class, 'index'])->name('index');
        Route::post('/', [WeaponTransferController::class, 'store'])->name('store');
        Route::post('/{id}/approve', [WeaponTransferController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [WeaponTransferController::class, 'reject'])->name('reject');
    });

    // Weapon Hibah Transfers
    Route::prefix('/weapons/hibah-transfers')->name('weapons.hibah-transfers.')->group(function () {
        Route::get('/', [WeaponHibahTransferController::class, 'index'])->name('index');
        Route::post('/', [WeaponHibahTransferController::class, 'store'])->name('store');
        Route::get('/{transfer}', [WeaponHibahTransferController::class, 'show'])->name('show');
        Route::post('/{transfer}/submit', [WeaponHibahTransferController::class, 'submit'])->name('submit');
        Route::post('/{transfer}/approve', [WeaponHibahTransferController::class, 'approve'])->name('approve');
    });

      // Weapon Management
    Route::resource('/weapons', WeaponController::class)
        ->names('weapons');

});
