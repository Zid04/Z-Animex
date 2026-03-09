<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'pseudo',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relations principales
    |--------------------------------------------------------------------------
    */

    // Médias créés par l'utilisateur
    public function media()
    {
        return $this->hasMany(Media::class);
    }

    // Favoris
    public function favorites()
    {
        return $this->hasMany(UserFavorite::class);
    }

    // Notes
    public function ratings()
    {
        return $this->hasMany(UserRating::class);
    }

    // Progression des épisodes
    public function progress()
    {
        return $this->hasMany(UserEpisodeProgress::class);
    }
    public function watchlist()
{
    return $this->hasMany(Watchlist::class);
}

}
