<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

    // Redirection vers la page de profil
    Route::redirect('settings', '/settings/profile');

    /*
    |--------------------------------------------------------------------------
    | PROFILE SETTINGS
    |--------------------------------------------------------------------------
    */
    Route::get('settings/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('settings/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Suppression du compte
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | PASSWORD SETTINGS
    |--------------------------------------------------------------------------
    */
    Route::get('settings/password', [PasswordController::class, 'edit'])
        ->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    /*
    |--------------------------------------------------------------------------
    | APPEARANCE SETTINGS
    |--------------------------------------------------------------------------
    */
    Route::inertia('settings/appearance', 'settings/appearance')
        ->name('appearance.edit');

    /*
    |--------------------------------------------------------------------------
    | TWO FACTOR AUTHENTICATION
    |--------------------------------------------------------------------------
    */
    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
