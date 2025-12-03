<?php

use App\Http\Controllers\IAM\RoleController;
use App\Http\Controllers\IAM\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('iam')->group(function () {
        Route::resource('/users', UserController::class)->names('iam.users');
        Route::resource('/roles', RoleController::class)->names('iam.roles');
    });
});


