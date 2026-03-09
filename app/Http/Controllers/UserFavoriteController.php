<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;

class UserFavoriteController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $favorites = $user->favorites()
            ->with('media')
            ->paginate(12);

        return inertia('favorites/index', [
            'favorites' => $favorites,
        ]);
    }

    public function store(Media $media)
    {
        $user = auth()->user();

        // Empêche les doublons
        if ($user->favorites()->where('media_id', $media->id)->exists()) {
            return back()->with('error', 'Ce média est déjà en favori.');
        }
        
        $user->favorites()->create([
            'media_id' => $media->id,
        ]);

        return back();
    }

    public function destroy(Media $media)
    {
        $user = auth()->user();

        $user->favorites()
            ->where('media_id', $media->id)
            ->delete();

        return back();
    }
}
