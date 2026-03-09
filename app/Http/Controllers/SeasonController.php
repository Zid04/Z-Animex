<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Season;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SeasonController extends Controller
{
    /**
     * Display a list of seasons for a media
     */
    public function index(Media $media): Response
    {
        $media->load('seasons.episodes', 'user');

        return Inertia::render('media/seasons/index', [
            'media' => [
                'id' => $media->id,
                'title' => $media->title,
            ],
            'seasons' => $media->seasons->map(fn($season) => [
                'id' => $season->id,
                'number' => $season->number,
                'episodes_count' => $season->episodes->count(),
            ])->toArray(),
        ]);
    }

    /**
     * Show form for creating a new season
     */
    public function create(Media $media): Response
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('media/seasons/create', [
            'media' => [
                'id' => $media->id,
                'title' => $media->title,
            ],
        ]);
    }

    /**
     * Store a newly created season
     */
    public function store(Request $request, Media $media): RedirectResponse
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'number' => 'required|integer|min:1|max:999',
        ]);

        $season = $media->seasons()->create($validated);

        return redirect()->route('seasons.edit', [$media, $season])
            ->with('success', 'Saison créée avec succès');
    }

    /**
     * Show form for editing a season
     */
    public function edit(Media $media, Season $season): Response
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        return Inertia::render('media/seasons/edit', [
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
     * Update a season
     */
    public function update(Request $request, Media $media, Season $season): RedirectResponse
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        $validated = $request->validate([
            'number' => 'required|integer|min:1|max:999',
        ]);

        $season->update($validated);

        return redirect()->route('seasons.index', $media)
            ->with('success', 'Saison mise à jour avec succès');
    }

    /**
     * Delete a season
     */
    public function destroy(Media $media, Season $season): RedirectResponse
    {
        if ($media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($season->media_id !== $media->id) {
            abort(404);
        }

        $season->delete();

        return redirect()->route('seasons.index', $media)
            ->with('success', 'Saison supprimée avec succès');
    }
}
