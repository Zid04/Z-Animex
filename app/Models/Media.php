<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'cover',
        'year',
        'type',
        'visibility',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations principales
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }

    public function episodes()
    {
        return $this->hasManyThrough(Episode::class, Season::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(UserRating::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(UserEpisodeProgress::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopePublicOrOwned($query, $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('visibility', 'public')
              ->orWhere('user_id', $userId);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Attributs calculés
    |--------------------------------------------------------------------------
    */

    // Note moyenne du média
    public function getAverageRatingAttribute()
    {
        return $this->ratings()->avg('rating');
    }

    // L'utilisateur a-t-il mis ce média en favori ?
    public function isFavoritedBy($userId): bool
    {
        return $this->favorites()->where('user_id', $userId)->exists();
    }

    // Progression totale (en %)
    public function getProgressPercentageFor($userId): float
    {
        $totalEpisodes = $this->episodes()->count();

        if ($totalEpisodes === 0) {
            return 0;
        }

        $watched = $this->progress()->where('user_id', $userId)->count();

        return round(($watched / $totalEpisodes) * 100, 2);
    }
    public function watchlisted()
{
    return $this->hasMany(Watchlist::class);
}
public function comments()
{
    return $this->hasMany(Comment::class)->latest();
}
public function tags()
{
    return $this->belongsToMany(Tag::class);
}



}
