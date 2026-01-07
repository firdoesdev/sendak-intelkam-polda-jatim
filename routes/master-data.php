<?php

use App\Http\Controllers\MasterData\PoliceUnitController;
use App\Http\Controllers\MasterData\WarehouseController;
use App\Http\Controllers\MasterData\OrganizationController;
use App\Http\Controllers\MasterData\ApplicantController;
use App\Http\Controllers\MasterData\PersonController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('master-data')->group(function () {
        // Police Units
        Route::resource('/police-units', PoliceUnitController::class)
        ->only(['index','store','update','destroy'])
        ->names('master-data.police-units');

        // Warehouses
        Route::resource('/warehouses', WarehouseController::class)
        ->only(['index','store','update','destroy'])
        ->names('master-data.warehouses');

        // Organizations
        Route::resource('/organizations', OrganizationController::class)
        ->only(['index','store','update','destroy'])
        ->names('master-data.organizations');

        // Applicants
        Route::resource('/applicants', ApplicantController::class)
        ->only(['index','store','update','destroy'])
        ->names('master-data.applicants');

        // Persons
        Route::resource('/persons', PersonController::class)
        ->only(['index','store','update','destroy'])
        ->names('master-data.persons');
    });
});


