<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// TODO : enable welcome page
// use Laravel\Fortify\Features;

Route::get('/', function () {
    // TODO : enable welcome page
    // return Inertia::render('welcome', [
    //     'canRegister' => Features::enabled(Features::registration()),
    // ]);
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/octane-test', fn () => response('OK'));

require __DIR__.'/settings.php';
require __DIR__.'/iam.php';
require __DIR__.'/master-data.php';
require __DIR__.'/permits.php';
require __DIR__.'/weapons.php';
require __DIR__.'/handak.php';
