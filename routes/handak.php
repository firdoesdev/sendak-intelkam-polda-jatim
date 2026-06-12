<?php

use App\Http\Controllers\Handak\HandakLetterController;
use App\Http\Controllers\Handak\HandakPermitController;
use App\Http\Controllers\Handak\HandakStockController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/handak-permits', HandakPermitController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('handak-permits');

    Route::post('/handak-permits/{permit}/approve', [HandakPermitController::class, 'approve'])->name('handak-permits.approve');
    Route::post('/handak-permits/{permit}/issue-si', [HandakPermitController::class, 'issueSi'])->name('handak-permits.issue-si');
    Route::post('/handak-permits/{permit}/record-usage', [HandakPermitController::class, 'recordUsage'])->name('handak-permits.record-usage');
    Route::get('/handak-permits/{permit}/letter', [HandakLetterController::class, 'show'])->name('handak-permits.letter');

    Route::get('/handak-stock', [HandakStockController::class, 'index'])->name('handak-stock.index');
});
