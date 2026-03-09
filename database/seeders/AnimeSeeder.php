<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Anime;

class AnimeSeeder extends Seeder
{
    public function run(): void
    {
        $path = storage_path('app/anime.csv');
        $file = fopen($path, 'r');

        $headers = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false) {
            $data = array_combine($headers, $row);

            Anime::create([
                'mal_id' => $data['mal_id'],
                'title' => $data['title'],
                'images' => json_decode(str_replace("'", '"', $data['images']), true),
                'approved' => filter_var($data['approved'], FILTER_VALIDATE_BOOLEAN),
                'type' => $data['type'],
                'source' => $data['source'],
                'episodes' => (int) $data['episodes'],
                'status' => $data['status'],
                'airing' => filter_var($data['airing'], FILTER_VALIDATE_BOOLEAN),
                'duration' => $data['duration'],
                'score' => (float) $data['score'],
                'scored_by' => (int) $data['scored_by'],
                'rank' => (int) $data['rank'],
                'popularity' => (int) $data['popularity'],
                'members' => (int) $data['members'],
                'favorites' => (int) $data['favorites'],
                'year' => $data['year'] ? (int) $data['year'] : null,
                'studios' => json_decode(str_replace("'", '"', $data['studios']), true),
                'genres' => json_decode(str_replace("'", '"', $data['genres']), true),
            ]);
        }

        fclose($file);
    }
}
