<?php

use App\Http\Controllers\IAM\PermissionController;
use App\Http\Controllers\IAM\RoleController;
use App\Http\Controllers\IAM\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('iam')->group(function () {
        Route::resource('/users', UserController::class)->names('iam.users');
        Route::resource('/roles', RoleController::class)->names('iam.roles');
        Route::resource('/permissions', PermissionController::class)->names('iam.permissions');
        
        // Assign permissions to role
        Route::post('/roles/{role}/permissions', [RoleController::class, 'assignPermissions'])
            ->name('iam.roles.assign-permissions');
        
        // Assign roles to user
        Route::post('/users/{user}/roles', [UserController::class, 'assignRoles'])
            ->name('iam.users.assign-roles');
    });
});


