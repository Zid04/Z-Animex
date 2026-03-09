<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Episode extends Model
{
    protected $fillable = [
        'season_id',
        'number',
        'title',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations principales
    |--------------------------------------------------------------------------
    */

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(UserEpisodeProgress::class);
    }

   

    public function media(): HasOneThrough
    {
        return $this->hasOneThrough(
            Media::class,   // Modèle final
            Season::class,  // Modèle intermédiaire
            'id',           // Clé primaire de Season
            'id',           // Clé primaire de Media
            'season_id',    // Clé étrangère dans Episode
            'media_id'      // Clé étrangère dans Season
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Méthodes utilitaires
    |--------------------------------------------------------------------------
    */

    // L'utilisateur a-t-il vu cet épisode ?
    public function isWatchedBy($userId): bool
    {
        return $this->progress()
            ->where('user_id', $userId)
            ->exists();
    }

    // Date de visionnage (ou null)
    public function watchedAt($userId)
    {
        return $this->progress()
            ->where('user_id', $userId)
            ->value('watched_at');
    }
}
