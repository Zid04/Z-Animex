<?php

namespace App\Http\Controllers;

use App\Models\WatchlistCollection;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WatchlistCollectionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        WatchlistCollection::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        return back()->with('success', 'Watchlist créée avec succès!');
    }

    public function update(Request $request, WatchlistCollection $collection): RedirectResponse
    {
        // Vérifier que l'utilisateur est propriétaire
        if ($collection->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $collection->update($validated);

        return back()->with('success', 'Watchlist mise à jour!');
    }

    public function destroy(WatchlistCollection $collection): RedirectResponse
    {
        // Vérifier que l'utilisateur est propriétaire
        if ($collection->user_id !== Auth::id()) {
            abort(403);
        }

        $collection->delete();

        return back()->with('success', 'Watchlist supprimée!');
    }
}
