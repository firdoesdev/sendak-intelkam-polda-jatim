<?php

namespace Database\Factories;

use App\Models\Permit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Permit>
 */
class PermitFactory extends Factory
{
    protected $model = Permit::class;

    public function definition(): array
    {
        $user = User::first() ?? User::factory()->create();
        
        return [
            'permit_type' => fake()->randomElement(['SENPI', 'SPORT', 'POLSUS', 'HANDAK']),
            'status' => 'draft',
            'valid_from' => now(),
            'valid_to' => now()->addYear(),
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ];
    }
}
