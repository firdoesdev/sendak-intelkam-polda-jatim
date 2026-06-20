<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Spatie\Permission\Models\Permission;

test('inertia request denied by authorization is redirected back with error flash', function () {
    Permission::findOrCreate('view-handak-permits', 'web');

    $this->actingAs(User::factory()->create());

    // Match the asset version so Inertia returns the redirect rather than a 409 reload.
    $version = app(HandleInertiaRequests::class)->version(request());

    $response = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => (string) $version,
    ])->get(route('handak-permits.index'));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('error page component is rendered for 404 outside local environment', function () {
    $this->app['env'] = 'production';

    $response = $this->withHeader('X-Inertia', 'true')
        ->get('/non-existent-route-xyz');

    $response->assertStatus(404);
    $response->assertJsonPath('component', 'error-page');
    $response->assertJsonPath('props.status', 404);
});
