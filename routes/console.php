<?php

use App\Actions\Permits\CheckAndUpdateToExpired;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule a daily task to check and update expired permits
Schedule::call(function () {
    $action = new CheckAndUpdateToExpired;
    $action->execute();
})
    ->timezone('Asia/Jakarta')
    ->daily()
    ->name('Check and Update Expired Permits')
    ->withoutOverlapping();

// Schedule a daily task to expire Kartu Pengpin that have passed their expiry date
Schedule::command('kartu-pengpin:expire')
    ->timezone('Asia/Jakarta')
    ->daily()
    ->name('Expire Kartu Pengpin')
    ->withoutOverlapping();

// Schedule a daily task to notify holders of Kartu Pengpin expiring within 30 days
Schedule::command('kartu-pengpin:notify-expiring --days=30')
    ->timezone('Asia/Jakarta')
    ->daily()
    ->name('Notify Expiring Kartu Pengpin')
    ->withoutOverlapping();
