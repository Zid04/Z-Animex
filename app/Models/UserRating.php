<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRating extends Model
{
    protected $fillable = [
        'user_id',
        'media_id',
        'rating',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    /*
    Relations principales
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function media()
    {
        return $this->belongsTo(Media::class);
    }

    /*
     Scopes utiles
    */

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForMedia($query, $mediaId)
    {
        return $query->where('media_id', $mediaId);
    }

    /*
    Méthodes utilitaires
    */

    // Vérifie si un utilisateur a déjà noté un média
    public static function hasRated($userId, $mediaId): bool
    {
        return static::where('user_id', $userId)
            ->where('media_id', $mediaId)
            ->exists();
    }

    // Récupère la note d'un utilisateur pour un média
    public static function getUserRating($userId, $mediaId): ?int
    {
        return static::where('user_id', $userId)
            ->where('media_id', $mediaId)
            ->value('rating');
    }
}
