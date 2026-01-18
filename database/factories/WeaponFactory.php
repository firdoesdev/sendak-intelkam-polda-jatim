<?php

namespace Database\Factories;

use App\Models\Weapon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Weapon>
 */
class WeaponFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Weapon::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->regexify('[A-Z]{3}-[0-9]{5}'),
            'name' => fake()->word() . ' ' . fake()->randomElement(['Pistol', 'Rifle', 'Shotgun']),
            'permit_type' => fake()->randomElement(['SENPI', 'SPORT', 'POLSUS']),
            'weapon_type' => fake()->randomElement(['Pistol', 'Rifle', 'Shotgun']),
            'serial_number' => fake()->unique()->regexify('[A-Z0-9]{10}'),
            'manufacturer' => fake()->company(),
            'caliber' => fake()->randomElement(['.22', '9mm', '.45', '5.56mm']),
            'acquisition_date' => now(),
            'condition' => 'good',
            'status' => 'available',
            'acquisition_type' => 'new',
            'is_active' => true,
            'warehouse_id' => \App\Models\Warehouse::inRandomOrder()->first()?->id,
        ];
    }
}
