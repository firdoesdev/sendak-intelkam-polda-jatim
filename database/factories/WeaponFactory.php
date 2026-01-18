<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class WeaponFactory extends Factory
{

    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->regexify('[A-Z]{3}-[0-9]{5}'),
            'name' => $this->faker->word() . ' ' . $this->faker->randomElement(['Pistol', 'Rifle', 'Shotgun']),
            'permit_type' => $this->faker->randomElement(['SENPI', 'SPORT', 'POLSUS']),
            'weapon_type' => $this->faker->randomElement(['Pistol', 'Rifle', 'Shotgun']),
            'serial_number' => $this->faker->unique()->regexify('[A-Z0-9]{10}'),
            'manufacturer' => $this->faker->company(),
            'caliber' => $this->faker->randomElement(['.22', '9mm', '.45', '5.56mm']),
            'acquisition_date' => now(),
            'condition' => 'good',
            'status' => 'available',
            'acquisition_type' => 'new',
            'is_active' => true,
            'warehouse_id' => \App\Models\Warehouse::inRandomOrder()->first()?->id,
        ];
    }
}
