<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class MediaController extends Controller
{
  
public function index(Request $request): Response
{
    $query = Media::query()->publicOrOwned(Auth::id());

    /*
    |--------------------------------------------------------------------------
    | Recherche
    |--------------------------------------------------------------------------
    */
    if ($search = $request->get('search')) {
        $query->where('title', 'like', "%{$search}%");
    }

    /*
    |--------------------------------------------------------------------------
    | Filtre type
    |--------------------------------------------------------------------------
    */
    if ($type = $request->get('type')) {
        $query->where('type', $type);
    }

    /*
    |--------------------------------------------------------------------------
    | Filtre année
    |--------------------------------------------------------------------------
    */
    if ($year = $request->get('year')) {
        $query->where('year', $year);
    }

    /*
    |--------------------------------------------------------------------------
    | Filtre multi-tags
    |--------------------------------------------------------------------------
    */
    if ($tags = $request->get('tags')) {
        $tagIds = explode(',', $tags);

        $query->whereHas('tags', function ($q) use ($tagIds) {
            $q->whereIn('tags.id', $tagIds);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Filtre statut (vu / en cours / non vu)
    |--------------------------------------------------------------------------
    */
    if ($status = $request->get('status')) {
        $user = Auth::user();

        match ($status) {
            'completed' => $query->whereHas('episodes', function ($q) use ($user) {
                $q->whereIn('id', $user->progress()->pluck('episode_id'));
            }),
            'in_progress' => $query->whereHas('episodes', function ($q) use ($user) {
                $watched = $user->progress()->pluck('episode_id');
                $q->whereIn('id', $watched)
                  ->orWhereNotIn('id', $watched);
            }),
            'not_started' => $query->whereDoesntHave('episodes', function ($q) use ($user) {
                $q->whereIn('id', $user->progress()->pluck('episode_id'));
            }),
            default => null,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Tri
    |--------------------------------------------------------------------------
    */
    if ($sort = $request->get('sort')) {
        match ($sort) {
            'rating' => $query->orderByDesc('average_rating'),
            'newest' => $query->orderByDesc('created_at'),
            'oldest' => $query->orderBy('created_at'),
            default => null,
        };
    } else {
        $query->latest();
    }

    $media = $query->paginate(20)->withQueryString();

    return Inertia::render('media/index', [
        'media' => $media,
        'filters' => $request->only(['search', 'type', 'year', 'tags', 'status', 'sort']),
        'tags' => \App\Models\Tag::orderBy('name')->get(['id', 'name']),
        'years' => Media::select('year')->distinct()->orderByDesc('year')->pluck('year'),
    ]);
}



    public function myMedia(): Response
    {
        $media = Media::where('user_id', Auth::id())
            ->latest()
            ->paginate(20);

        return Inertia::render('media/my-media', [
            'media' => $media,
        ]);
    }

    public function create(): Response
    {
        $allTags = \App\Models\Tag::orderBy('name')->get(['id', 'name']);

        return Inertia::render('media/create', [
            'all_tags' => $allTags->map(fn($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
            ])->toArray(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y') + 1],
            'type' => ['required', 'in:anime,movie,series'],
            'visibility' => ['required', 'in:public,private'],
            'cover' => ['nullable', 'image', 'max:2048'],
            'cover_url' => ['nullable', 'url'],
        ], [
            'title.required' => 'Le titre est obligatoire.',
            'title.min' => 'Le titre doit contenir au moins 3 caractères.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'description.max' => 'La description ne peut pas dépasser 5000 caractères.',
            'year.min' => 'L\'année doit être supérieure à 1900.',
            'year.max' => "L'année ne peut pas être supérieure à " . (date('Y') + 1),
            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type sélectionné n\'est pas valide.',
            'visibility.required' => 'La visibilité est obligatoire.',
            'cover.image' => 'Le fichier doit être une image valide.',
            'cover.max' => 'L\'image ne doit pas dépasser 2 MB.',
            'cover_url.url' => 'Veuillez entrer une URL valide pour l\'image.',
        ]);

        $validated['user_id'] = Auth::id();

        // Gérer l'image : fichier ou URL
        if ($request->hasFile('cover')) {
            $validated['cover'] = $request->file('cover')->store('covers', 'public');
        } elseif ($request->filled('cover_url')) {
            $validated['cover'] = $request->input('cover_url');
        }

        $media = Media::create($validated);

        // Traiter les saisons et épisodes
        $seasonsInput = $request->input('seasons', []);
        
        foreach ($seasonsInput as $seasonNumber => $seasonData) {
            // Décoder le JSON si c'est une string
            $season = is_string($seasonData) ? json_decode($seasonData, true) : $seasonData;
            
            if ($season && isset($season['number'])) {
                $createdSeason = $media->seasons()->create([
                    'number' => $season['number'],
                ]);

                // Ajouter les épisodes
                if (isset($season['episodes']) && is_array($season['episodes'])) {
                    foreach ($season['episodes'] as $episode) {
                        $createdSeason->episodes()->create([
                            'number' => $episode['number'],
                            'title' => $episode['title'] ?? "Épisode {$episode['number']}",
                        ]);
                    }
                }
            }
        }

        // Attacher les tags
        $tags = $request->input('tags', []);
        if (!empty($tags)) {
            $media->tags()->sync($tags);
        }

        return redirect()->route('media.show', $media)->with('status', 'Media created.');
    }

    public function show(Media $media): Response
    {
        if ($media->visibility === 'private' && $media->user_id !== Auth::id()) {
            abort(403);
        }

        $user = Auth::user();

        // Charger saisons + épisodes + commentaires + tags
        $media->load(
            'seasons.episodes',
            'user',
            'comments.user',
            'tags'
        );

        // Charger tous les tags disponibles pour l'interface d'ajout
        $allTags = \App\Models\Tag::orderBy('name')->get(['id', 'name']);

        /*
        |--------------------------------------------------------------------------
        | Progression globale
        |--------------------------------------------------------------------------
        */

        // Récupérer les IDs des épisodes depuis les saisons déjà chargées
        $episodeIds = $media->seasons->flatMap(fn($season) => $season->episodes->pluck('id'))->toArray();
        
        $episodesTotal = count($episodeIds);

        $episodesWatched = $user->progress()
            ->whereIn('episode_id', $episodeIds)
            ->count();

        $progressPercent = $episodesTotal > 0
            ? round(($episodesWatched / $episodesTotal) * 100)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Progression par saison
        |--------------------------------------------------------------------------
        */

        $seasonsProgress = $media->seasons->map(function ($season) use ($user) {
            $total = $season->episodes()->count();
            $watched = $season->progress()->where('user_id', $user->id)->count();

            return [
                'season_id' => $season->id,
                'number' => $season->number,
                'episodes_total' => $total,
                'episodes_watched' => $watched,
                'percent' => $total > 0 ? round(($watched / $total) * 100) : 0,
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | Notes, Favoris, Watchlist
        |--------------------------------------------------------------------------
        */

        $userRating = $user->ratings()
            ->where('media_id', $media->id)
            ->value('rating');

        $isFavorite = $user->favorites()
            ->where('media_id', $media->id)
            ->exists();

        $isInWatchlist = $user->watchlist()
            ->where('media_id', $media->id)
            ->exists();

        /*
        |--------------------------------------------------------------------------
        | Collections de l'utilisateur
        |--------------------------------------------------------------------------
        */
        $collections = \App\Models\WatchlistCollection::where('user_id', $user->id)
            ->orderBy('title')
            ->get(['id', 'title', 'description'])
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Envoi à Inertia
        |--------------------------------------------------------------------------
        */

        return Inertia::render('media/show', [
            'media' => [
                'id' => $media->id,
                'title' => $media->title,
                'description' => $media->description,
                'type' => $media->type,
                'year' => $media->year,
                'visibility' => $media->visibility,
                'cover' => $media->cover,
                'user' => $media->user?->only(['id', 'name']),
                'user_rating' => $userRating,
                'is_favorite' => $isFavorite,
                'is_in_watchlist' => $isInWatchlist,
                'average_rating' => $media->average_rating,
                'progress_percentage' => $progressPercent,
                'comments' => $media->comments->map(fn($comment) => [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'user_id' => $comment->user_id,
                    'user' => $comment->user->only(['id', 'name']),
                ])->toArray(),
                'tags' => $media->tags->map(fn($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                ])->toArray(),
                'all_tags' => $allTags->map(fn($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                ])->toArray(),
                'seasons' => $media->seasons->map(fn($season) => [
                    'id' => $season->id,
                    'number' => $season->number,
                    'title' => $season->title,
                    'episodes' => $season->episodes->map(fn($episode) => [
                        'id' => $episode->id,
                        'number' => $episode->number,
                        'title' => $episode->title,
                        'watched' => $user->progress()
                            ->where('episode_id', $episode->id)
                            ->exists(),
                    ])->toArray(),
                ])->toArray(),
            ],
            'progress' => [
                'episodes_total' => $episodesTotal,
                'episodes_watched' => $episodesWatched,
                'percent' => $progressPercent,
                'seasons' => $seasonsProgress,
            ],
            'watchlist_collections' => $collections,
        ]);
    }

    public function edit(Media $media): Response
    {
        // Permettre l'édition si:
        // 1. L'utilisateur est propriétaire du média
        // 2. Le média est public (user_id = null)
        if ($media->user_id !== null && $media->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('media/edit', [
            'media' => $media,
        ]);
    }

    public function update(Request $request, Media $media): RedirectResponse
    {
        // Permettre la mise à jour si:
        // 1. L'utilisateur est propriétaire du média
        // 2. Le média est public (user_id = null)
        if ($media->user_id !== null && $media->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y') + 1],
            'type' => ['required', 'in:anime,movie,series'],
            'visibility' => ['required', 'in:public,private'],
            'cover' => ['nullable', 'image', 'max:2048'],
            'cover_url' => ['nullable', 'url'],
        ], [
            'title.required' => 'Le titre est obligatoire.',
            'title.min' => 'Le titre doit contenir au moins 3 caractères.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'description.max' => 'La description ne peut pas dépasser 5000 caractères.',
            'year.min' => 'L\'année doit être supérieure à 1900.',
            'year.max' => "L'année ne peut pas être supérieure à " . (date('Y') + 1),
            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type sélectionné n\'est pas valide.',
            'visibility.required' => 'La visibilité est obligatoire.',
            'cover.image' => 'Le fichier doit être une image valide.',
            'cover.max' => 'L\'image ne doit pas dépasser 2 MB.',
            'cover_url.url' => 'Veuillez entrer une URL valide pour l\'image.',
        ]);

        // Gérer l'image : fichier ou URL
        if ($request->hasFile('cover')) {
            // Si l'ancienne couverture est un fichier (pas une URL), la supprimer
            if ($media->cover && !str_starts_with($media->cover, 'http')) {
                Storage::disk('public')->delete($media->cover);
            }
            $validated['cover'] = $request->file('cover')->store('covers', 'public');
        } elseif ($request->filled('cover_url')) {
            // Si l'ancienne couverture est un fichier, la supprimer avant de mettre l'URL
            if ($media->cover && !str_starts_with($media->cover, 'http')) {
                Storage::disk('public')->delete($media->cover);
            }
            $validated['cover'] = $request->input('cover_url');
        }

        $media->update($validated);

        return back()->with('status', 'Media updated.');
    }

    public function destroy(Media $media): RedirectResponse
    {
        // Permettre la suppression si:
        // 1. L'utilisateur est propriétaire du média
        // 2. Le média est public (user_id = null)
        if ($media->user_id !== null && $media->user_id !== Auth::id()) {
            abort(403);
        }

        if ($media->cover) {
            Storage::disk('public')->delete($media->cover);
        }

        $media->delete();

        return redirect()->route('media.index')->with('status', 'Media deleted.');
    }
}
