<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'Action',
            'Romance',
            'Comédie',
            'Drame',
            'Fantaisie',
            'Science-Fiction',
            'Horreur',
            'Aventure',
            'Thriller',
            'Mystère',
            'Animation',
            'Documentaire',
        ];

        foreach ($tags as $tagName) {
            Tag::firstOrCreate(['name' => $tagName]);
        }
    }
}
