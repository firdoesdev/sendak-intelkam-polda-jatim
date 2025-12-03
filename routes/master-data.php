<?php

use App\Http\Controllers\MasterData\PoliceUnitController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('master-data')->group(function () {
        Route::resource('/police-units', PoliceUnitController::class)->names('master-data.police-units');
    });
});


