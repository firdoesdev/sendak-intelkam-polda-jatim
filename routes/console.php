<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

use App\Actions\Permits\CheckAndUpdateToExpired;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule a daily task to check and update expired permits
Schedule::call(function () {
    $action = new CheckAndUpdateToExpired();
    $action->execute();
})
->timezone('Asia/Jakarta')
->daily()
->name('Check and Update Expired Permits')
->withoutOverlapping();