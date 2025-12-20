<?php

use App\Http\Controllers\Permits\PermitController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/permits', PermitController::class)->names('permits');
});
