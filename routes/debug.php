<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WatchlistController;

Route::middleware(['auth'])->get('/api/watchlist-debug', function () {
    $controller = new WatchlistController();
    $response = $controller->index();
    
    // Accéder aux propriétés de la réponse Inertia
    $component = $response->component;  // 'media/watchlist'
    $props = $response->props;          // Props Inertia
    
    return response()->json($props, 200, ['Content-Type' => 'application/json']);
});
