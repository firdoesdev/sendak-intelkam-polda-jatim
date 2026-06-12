<?php

namespace Database\Factories;

use App\Models\ExplosivesMaterial;
use App\Models\Permit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExplosivesMaterial>
 */
class ExplosivesMaterialFactory extends Factory
{
    protected $model = ExplosivesMaterial::class;

    public function definition(): array
    {
        $materialType = fake()->randomElement(['Amonium Nitrate / Anfo', 'Dinamite / Power Gel', 'Detonator Cord', 'Detonator Listrik']);

        return [
            'permit_id' => Permit::factory(),
            'material_type' => $materialType,
            'item_name' => $materialType,
            'weight' => fake()->randomFloat(2, 1, 100),
            'quantity' => fake()->numberBetween(1, 50),
            'unit' => fake()->randomElement(['kg', 'm', 'pcs']),
        ];
    }
}
