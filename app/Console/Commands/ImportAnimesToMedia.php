<?php

namespace App\Console\Commands;

use App\Models\Anime;
use App\Models\Media;
use Illuminate\Console\Command;

class ImportAnimesToMedia extends Command
{
    protected $signature = 'app:import-animes-to-media';
    protected $description = 'Import all animes from the animes table to the media table as anime type';

    public function handle()
    {
        $animes = Anime::all();
        
        if ($animes->isEmpty()) {
            $this->error('Aucun anime trouvé dans la table animes.');
            return Command::FAILURE;
        }

        $count = 0;
        foreach ($animes as $anime) {
            // Vérifier si le média existe déjà
            $existingMedia = Media::where('title', $anime->title)->first();
            
            if (!$existingMedia) {
                // Récupérer l'URL de l'image depuis le JSON
                $coverUrl = null;
                if ($anime->images && isset($anime->images['jpg']['image_url'])) {
                    $coverUrl = $anime->images['jpg']['image_url'];
                }

                // Créer le média à partir de l'anime
                // Stocker l'URL complète dans le champ cover
                $media = Media::create([
                    'title' => $anime->title,
                    'type' => 'anime',
                    'year' => $anime->year,
                    'visibility' => 'public',
                    'user_id' => 1, // Par défaut, attribuer à l'utilisateur admin
                    'description' => null, // Pas de description fournie par MyAnimeList
                    'cover' => $coverUrl, // URL directe MyAnimeList
                ]);
                
                $count++;
            }
        }

        $this->info("✅ {$count} animes importés avec succès dans la table media!");
        return Command::SUCCESS;
    }
}
