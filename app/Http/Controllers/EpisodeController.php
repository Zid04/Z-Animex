<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Season;
use App\Models\Episode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EpisodeController extends Controller
{
    /**
     * Show form for creating a new episode
     */
    public function create(Media $media, Season $season): Response
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        return Inertia::render('media/seasons/episodes/create', [
            'media' => [
                'id' => $media->id,
                'title' => $media->title,
            ],
            'season' => [
                'id' => $season->id,
                'number' => $season->number,
            ],
        ]);
    }

    /**
     * Store a newly created episode
     */
    public function store(Request $request, Media $media, Season $season): RedirectResponse
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        $validated = $request->validate([
            'number' => 'required|integer|min:1|max:999',
            'title' => 'required|string|max:255',
        ]);

        $season->episodes()->create($validated);

        return redirect()->route('seasons.edit', [$media, $season])
            ->with('success', 'Épisode créé avec succès');
    }

    /**
     * Show form for editing an episode
     */
    public function edit(Media $media, Season $season, Episode $episode): Response
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        if ($episode->season_id !== $season->id) {
            abort(404);
        }

        return Inertia::render('media/seasons/episodes/edit', [
            'media' => [
                'id' => $media->id,
                'title' => $media->title,
            ],
            'season' => [
                'id' => $season->id,
                'number' => $season->number,
            ],
            'episode' => [
                'id' => $episode->id,
                'number' => $episode->number,
                'title' => $episode->title,
            ],
        ]);
    }

    /**
     * Update an episode
     */
    public function update(Request $request, Media $media, Season $season, Episode $episode): RedirectResponse
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        if ($episode->season_id !== $season->id) {
            abort(404);
        }

        $validated = $request->validate([
            'number' => 'required|integer|min:1|max:999',
            'title' => 'required|string|max:255',
        ]);

        $episode->update($validated);

        return redirect()->route('seasons.edit', [$media, $season])
            ->with('success', 'Épisode mis à jour avec succès');
    }

    /**
     * Delete an episode
     */
    public function destroy(Media $media, Season $season, Episode $episode): RedirectResponse
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        if ($episode->season_id !== $season->id) {
            abort(404);
        }

        $episode->delete();

        return redirect()->route('seasons.edit', [$media, $season])
            ->with('success', 'Épisode supprimé avec succès');
    }
}
