<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserEpisodeProgress extends Model
{
    protected $fillable = [
        'user_id',
        'episode_id',
        'watched_at',
    ];

    public $timestamps = false;

    protected $casts = [
        'watched_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function episode()
    {
        return $this->belongsTo(Episode::class);
    }

    public function season()
    {
        return $this->episode->season();
    }

    public function media()
    {
        return $this->episode->media();
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
