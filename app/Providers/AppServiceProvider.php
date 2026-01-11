<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\WeaponHibahTransferRequest;
use App\Models\KartuPengpin;
use App\Models\PermitDocument;
use App\Policies\WeaponHibahTransferRequestPolicy;
use App\Policies\KartuPengpinPolicy;
use App\Policies\PermitDocumentPolicy;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        Gate::policy(WeaponHibahTransferRequest::class, WeaponHibahTransferRequestPolicy::class);
        Gate::policy(KartuPengpin::class, KartuPengpinPolicy::class);
        Gate::policy(PermitDocument::class, PermitDocumentPolicy::class);
    }
}
