<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * Factory pour générer des données de test pour le modèle Media
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
class MediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'cover' => 'cover-' . fake()->numberBetween(1, 100) . '.jpg',
            'year' => fake()->numberBetween(1980, 2025),
            'type' => fake()->randomElement(['anime', 'movie', 'series']),
            'visibility' => 'public',
        ];
    }
}
