<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        /*
        |--------------------------------------------------------------------------
        | Statistiques globales
        |--------------------------------------------------------------------------
        */

        $totalMedia = Media::publicOrOwned($user->id)->count();
        $animeCount = Media::publicOrOwned($user->id)->where('type', 'anime')->count();
        $movieCount = Media::publicOrOwned($user->id)->where('type', 'movie')->count();
        $seriesCount = Media::publicOrOwned($user->id)->where('type', 'series')->count();

        /*
        |--------------------------------------------------------------------------
        | Statut (Terminé / En cours / Non commencé)
        |--------------------------------------------------------------------------
        */

        $completed = 0;
        $inProgress = 0;
        $notStarted = 0;

        $allMedia = Media::publicOrOwned($user->id)
            ->with('episodes')
            ->get();

        foreach ($allMedia as $media) {
            $total = $media->episodes->count();
            $watched = $user->progress()
                ->whereIn('episode_id', $media->episodes->pluck('id'))
                ->count();

            if ($total === 0) {
                $notStarted++;
            } elseif ($watched === 0) {
                $notStarted++;
            } elseif ($watched === $total) {
                $completed++;
            } else {
                $inProgress++;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Derniers médias ajoutés
        |--------------------------------------------------------------------------
        */

        $latestMedia = Media::publicOrOwned($user->id)
            ->with('tags:id,name')
            ->latest()
            ->take(6)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Envoi à Inertia
        |--------------------------------------------------------------------------
        */

        return inertia('dashboard', [
            'stats' => [
                'total' => $totalMedia,
                'anime' => $animeCount,
                'movies' => $movieCount,
                'series' => $seriesCount,
                'completed' => $completed,
                'in_progress' => $inProgress,
                'not_started' => $notStarted,
            ],
            'latest_media' => $latestMedia,
        ]);
    }
}
