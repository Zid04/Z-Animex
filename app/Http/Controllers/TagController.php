<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    public function attach(Request $request, Media $media)
    {
        // Vérifier que le user est propriétaire du média
        if ($media->user_id !== Auth::id()) {
            abort(403, 'Non autorisé');
        }

        $validated = $request->validate([
            'tag_id' => ['required', 'exists:tags,id'],
        ]);

        // Vérifier que le tag n'est pas déjà attaché
        if ($media->tags()->where('tag_id', $validated['tag_id'])->exists()) {
            return back()->with('error', 'Ce tag est déjà associé à ce média.');
        }

        $media->tags()->attach($validated['tag_id']);
        return back();
    }

    public function detach(Media $media, Tag $tag)
    {
        // Vérifier que le user est propriétaire du média
        if ($media->user_id !== Auth::id()) {
            abort(403, 'Non autorisé');
        }

        // Vérifier que le tag est effectivement associé
        if (!$media->tags()->where('tag_id', $tag->id)->exists()) {
            return back()->with('error', 'Ce tag n\'est pas associé à ce média.');
        }

        $media->tags()->detach($tag->id);
        return back();
    }
}
