<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;

class UserRatingController extends Controller
{
    public function store(Request $request, Media $media)
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:10'],
        ]);

        $user = auth()->user();

        // Empêche de noter deux fois le même média
        if ($user->ratings()->where('media_id', $media->id)->exists()) {
            return back()->with('error', 'Vous avez déjà noté ce média.');
        }

        $user->ratings()->create([
            'media_id' => $media->id,
            'rating' => $validated['rating'],
        ]);

        return back();
    }

    public function update(Request $request, Media $media)
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:10'],
        ]);

        $user = auth()->user();

        $rating = $user->ratings()->where('media_id', $media->id)->first();

        if (!$rating) {
            return back()->with('error', 'Note non trouvée.');
        }

        $rating->update(['rating' => $validated['rating']]);

        return back();
    }

    public function destroy(Media $media)
    {
        $user = auth()->user();

        $user->ratings()
            ->where('media_id', $media->id)
            ->delete();

        return back();
    }
}
