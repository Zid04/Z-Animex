<?php
namespace App\Http\Controllers;

use App\Models\Anime;
use Inertia\Inertia;

class AnimeController extends Controller
{
    public function index()
    {
        return Inertia::render('Animes/Index', [
            'animes' => Anime::orderBy('rank')->get(),
        ]);
    }

    public function show(Anime $anime)
    {
        return Inertia::render('Animes/Show', [
            'anime' => $anime,
        ]);
    }
}
