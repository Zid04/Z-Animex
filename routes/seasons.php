<?php

use App\Http\Controllers\SeasonController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\ProgressController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | SEASONS (Saisons d'une série/anime)
    |--------------------------------------------------------------------------
    */
    
    // Liste des saisons
    Route::get('/media/{media}/seasons', [SeasonController::class, 'index'])->name('seasons.index');
    
    // Création
    Route::get('/media/{media}/seasons/create', [SeasonController::class, 'create'])->name('seasons.create');
    Route::post('/media/{media}/seasons', [SeasonController::class, 'store'])->name('seasons.store');
    
    // Modification
    Route::get('/media/{media}/seasons/{season}/edit', [SeasonController::class, 'edit'])->name('seasons.edit');
    Route::patch('/media/{media}/seasons/{season}', [SeasonController::class, 'update'])->name('seasons.update');
    
    // Suppression
    Route::delete('/media/{media}/seasons/{season}', [SeasonController::class, 'destroy'])->name('seasons.destroy');

    /*
    |--------------------------------------------------------------------------
    | EPISODES (Épisodes d'une saison)
    |--------------------------------------------------------------------------
    */
    
    // Création
    Route::get('/media/{media}/seasons/{season}/episodes/create', [EpisodeController::class, 'create'])->name('episodes.create');
    Route::post('/media/{media}/seasons/{season}/episodes', [EpisodeController::class, 'store'])->name('episodes.store');
    
    // Modification
    Route::get('/media/{media}/seasons/{season}/episodes/{episode}/edit', [EpisodeController::class, 'edit'])->name('episodes.edit');
    Route::patch('/media/{media}/seasons/{season}/episodes/{episode}', [EpisodeController::class, 'update'])->name('episodes.update');
    
    // Suppression
    Route::delete('/media/{media}/seasons/{season}/episodes/{episode}', [EpisodeController::class, 'destroy'])->name('episodes.destroy');

    /*
    |--------------------------------------------------------------------------
    | PROGRESSION (Marquer épisodes comme regardés)
    |--------------------------------------------------------------------------
    */

    // Marquer comme regardé
    Route::post('/media/{media}/seasons/{season}/episodes/{episode}/progress', [ProgressController::class, 'store'])->name('progress.store');
    
    // Retirer de la progression
    Route::delete('/media/{media}/seasons/{season}/episodes/{episode}/progress', [ProgressController::class, 'destroy'])->name('progress.destroy');
});
