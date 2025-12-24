<?php

use App\Models\User;

test('guests are redirected to login when accessing permit renewals', function () {
    $this->get(route('permits.renewals.index'))->assertRedirect(route('login'));
});

test('authenticated users can access permit renewals index', function () {
    $this->actingAs($user = User::first() ?? User::factory()->create());

    $this->get(route('permits.renewals.index'))->assertOk();
});
