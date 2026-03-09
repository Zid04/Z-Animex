<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

/*
|--------------------------------------------------------------------------
| Debug Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->get('/api/watchlist-debug', function () {
    $controller = new \App\Http\Controllers\WatchlistController();
    $response = $controller->index();
    
    // Accéder aux propriétés de la réponse Inertia
    $props = $response->props;
    
    return response()->json($props, 200, ['Content-Type' => 'application/json']);
});

/*
|--------------------------------------------------------------------------
| Avatars par défaut
|--------------------------------------------------------------------------
*/
Route::get('/avatars/defaults/{filename}', function ($filename) {
    // Whitelist - accepter seulement les noms valides
    if (!preg_match('/^avatar-\d+\.(jpg|png|webp|avif)$/i', $filename)) {
        abort(404, 'Avatar not found');
    }

    $path = public_path("avatars/defaults/{$filename}");

    // Vérifier que le fichier existe
    if (!file_exists($path)) {
        abort(404, 'Avatar not found');
    }

    // Déterminer le MIME type
    $mimeType = 'image/jpeg';
    if (str_ends_with($filename, '.png')) {
        $mimeType = 'image/png';
    } elseif (str_ends_with($filename, '.webp')) {
        $mimeType = 'image/webp';
    } elseif (str_ends_with($filename, '.avif')) {
        $mimeType = 'image/avif';
    }

    return response()->file($path, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000', // 1 an de cache
    ]);
})->name('avatars.default');


require __DIR__.'/settings.php';
require __DIR__.'/media.php';
require __DIR__.'/seasons.php';
