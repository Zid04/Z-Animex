<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Watchlist;
use App\Models\WatchlistCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    public function store(Request $request, Media $media)
    {
        $user = auth()->user();

        // Valider la collection si fournie
        $collection_id = $request->input('watchlist_collection_id');
        if ($collection_id) {
            $collection = WatchlistCollection::where('user_id', $user->id)
                ->where('id', $collection_id)
                ->firstOrFail();
        }

        // Empêche les doublons
        if ($user->watchlist()->where('media_id', $media->id)->exists()) {
            return back()->with('error', 'Ce média est déjà dans votre watchlist.');
        }

        Watchlist::create([
            'user_id' => $user->id,
            'media_id' => $media->id,
            'watchlist_collection_id' => $collection_id,
        ]);

        return back();
    }

    public function storeNamed(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        Watchlist::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return back();
    }

    public function destroy(Media $media)
    {
        $watchlist = Watchlist::where('user_id', Auth::id())
            ->where('media_id', $media->id)
            ->first();

        if (!$watchlist) {
            abort(403, 'Unauthorized');
        }

        $watchlist->delete();

        return back();
    }

    public function index()
    {
        // Récupérer les collections de l'utilisateur avec leurs watchlists
        $rawCollections = WatchlistCollection::where('user_id', Auth::id())
            ->with(['watchlists' => function ($query) {
                $query->with('media');
            }])
            ->latest()
            ->get();

        // Récupérer les items de la watchlist par défaut (sans collection)
        $rawItems = Watchlist::where('user_id', Auth::id())
            ->whereNull('watchlist_collection_id')
            ->with('media')
            ->latest()
            ->get();

        // Transformer les items en array pour éviter les extensions Inertia
        $items = $rawItems->map(function ($watchlist) {
            return [
                'id' => $watchlist->id,
                'media' => [
                    'id' => $watchlist->media->id,
                    'title' => $watchlist->media->title,
                    'cover' => $watchlist->media->cover,
                    'year' => $watchlist->media->year,
                    'type' => $watchlist->media->type,
                ],
            ];
        })->values();

        // Transformer les collections en array
        $collections = $rawCollections->map(function ($collection) {
            return [
                'id' => $collection->id,
                'title' => $collection->title,
                'description' => $collection->description,
                'watchlists' => $collection->watchlists->map(function ($watchlist) {
                    return [
                        'id' => $watchlist->id,
                        'media' => [
                            'id' => $watchlist->media->id,
                            'title' => $watchlist->media->title,
                            'cover' => $watchlist->media->cover,
                            'year' => $watchlist->media->year,
                            'type' => $watchlist->media->type,
                        ],
                    ];
                })->values(),
            ];
        })->values();

        return inertia('media/watchlist', [
            'items' => $items,
            'collections' => $collections,
        ]);
    }
}
