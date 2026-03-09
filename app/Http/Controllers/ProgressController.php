<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use App\Models\Media;
use App\Models\Season;
use App\Models\UserEpisodeProgress;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    public function store(Media $media, Season $season, Episode $episode)
    {
        // Validations: vérifier que tout appartient ensemble
        if ($season->media_id !== $media->id) {
            abort(404, 'Saison introuvable pour ce média');
        }
        
        if ($episode->season_id !== $season->id) {
            abort(404, 'Épisode introuvable pour cette saison');
        }

        $user = Auth::user();

        // Empêche les doublons
        UserEpisodeProgress::firstOrCreate([
            'user_id' => $user->id,
            'episode_id' => $episode->id,
        ], [
            'watched_at' => now(),
        ]);

        return back();
    }

    public function destroy(Media $media, Season $season, Episode $episode)
    {
        // Validations: vérifier que tout appartient ensemble
        if ($season->media_id !== $media->id) {
            abort(404, 'Saison introuvable pour ce média');
        }
        
        if ($episode->season_id !== $season->id) {
            abort(404, 'Épisode introuvable pour cette saison');
        }

        $user = Auth::user();

        UserEpisodeProgress::where('user_id', $user->id)
            ->where('episode_id', $episode->id)
            ->delete();

        return back();
    }
}
