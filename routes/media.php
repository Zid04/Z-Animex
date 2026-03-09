<?php

use App\Http\Controllers\MediaController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\UserRatingController;
use App\Http\Controllers\UserFavoriteController;
use App\Http\Controllers\WatchlistController;
use App\Http\Controllers\WatchlistCollectionController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\AnimeController;

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | MEDIA (Catalogue)
    |--------------------------------------------------------------------------
    */
    Route::get('/media', [MediaController::class, 'index'])->name('media.index');

    // Création
    Route::get('/media/create', [MediaController::class, 'create'])->name('media.create');
    Route::post('/media', [MediaController::class, 'store'])->name('media.store');

    // Détails
    Route::get('/media/{media}', [MediaController::class, 'show'])->name('media.show');

    // Modification
    Route::get('/media/{media}/edit', [MediaController::class, 'edit'])->name('media.edit');
    Route::patch('/media/{media}', [MediaController::class, 'update'])->name('media.update');

    // Suppression
    Route::delete('/media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

    // Mes médias
    Route::get('/my-media', [MediaController::class, 'myMedia'])->name('media.mine');


    /*
    |--------------------------------------------------------------------------
    | PROGRESSION (Episodes vus)
    |--------------------------------------------------------------------------
    */
    Route::post(
        '/media/{media}/seasons/{season}/episodes/{episode}/progress',
        [ProgressController::class, 'store']
    )->name('progress.store');

    Route::delete(
        '/media/{media}/seasons/{season}/episodes/{episode}/progress',
        [ProgressController::class, 'destroy']
    )->name('progress.destroy');


    /*
    |--------------------------------------------------------------------------
    | RATINGS (Notes)
    |--------------------------------------------------------------------------
    */
    Route::post('/media/{media}/rating', [UserRatingController::class, 'store'])->name('ratings.store');
    Route::put('/media/{media}/rating', [UserRatingController::class, 'update'])->name('ratings.update');
    Route::delete('/media/{media}/rating', [UserRatingController::class, 'destroy'])->name('ratings.destroy');


    /*
    |--------------------------------------------------------------------------
    | FAVORITES (Favoris)
    |--------------------------------------------------------------------------
    */
    Route::post('/media/{media}/favorite', [UserFavoriteController::class, 'store'])->name('favorites.store');
    Route::delete('/media/{media}/favorite', [UserFavoriteController::class, 'destroy'])->name('favorites.destroy');


    /*
    |--------------------------------------------------------------------------
    | WATCHLIST
    |--------------------------------------------------------------------------
    */
    Route::post('/media/{media}/watchlist', [WatchlistController::class, 'store'])->name('watchlist.store');
    Route::delete('/media/{media}/watchlist', [WatchlistController::class, 'destroy'])->name('watchlist.destroy');
    Route::get('/watchlist', [WatchlistController::class, 'index'])->name('watchlist.index');

    /*
    |--------------------------------------------------------------------------
    | WATCHLIST COLLECTIONS (Listes personnalisées)
    |--------------------------------------------------------------------------
    */
    Route::post('/watchlist-collections', [WatchlistCollectionController::class, 'store'])->name('watchlist-collections.store');
    Route::patch('/watchlist-collections/{collection}', [WatchlistCollectionController::class, 'update'])->name('watchlist-collections.update');
    Route::delete('/watchlist-collections/{collection}', [WatchlistCollectionController::class, 'destroy'])->name('watchlist-collections.destroy');


    /*
    |--------------------------------------------------------------------------
    | COMMENTS
    |--------------------------------------------------------------------------
    */
    Route::post('/media/{media}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');


    /*
    |--------------------------------------------------------------------------
    | TAGS
    |--------------------------------------------------------------------------
    */
    Route::post('/media/{media}/tags', [TagController::class, 'attach'])->name('tags.attach');
    Route::delete('/media/{media}/tags/{tag}', [TagController::class, 'detach'])->name('tags.detach');


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/animes', [AnimeController::class, 'index'])->name('animes.index');
    Route::get('/animes/{anime}', [AnimeController::class, 'show'])->name('animes.show');



});
