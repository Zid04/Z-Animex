<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    protected $fillable = [
        'media_id',
        'number',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations principales
    |--------------------------------------------------------------------------
    */

    public function media()
    {
        return $this->belongsTo(Media::class);
    }

    public function episodes(): HasMany
    {
        return $this->hasMany(Episode::class);
    }

    public function progress()
    {
        return $this->hasManyThrough(
            UserEpisodeProgress::class,
            Episode::class,
            'season_id',   // FK dans episodes
            'episode_id',  // FK dans progress
            'id',          // PK dans seasons
            'id'           // PK dans episodes
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Attributs calculés
    |--------------------------------------------------------------------------
    */

    // Nombre total d'épisodes dans la saison
    public function getEpisodesCountAttribute(): int
    {
        return $this->episodes()->count();
    }

    // Progression de l'utilisateur dans cette saison (en %)
    public function getProgressPercentageFor($userId): float
    {
        $total = $this->episodes()->count();

        if ($total === 0) {
            return 0;
        }

        $watched = $this->progress()
            ->where('user_id', $userId)
            ->count();

        return round(($watched / $total) * 100, 2);
    }
}
