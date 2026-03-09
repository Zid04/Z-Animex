<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
    protected $fillable = [
        'user_id',
        'media_id',
        'watchlist_collection_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function media()
    {
        return $this->belongsTo(Media::class);
    }

    public function collection()
    {
        return $this->belongsTo(WatchlistCollection::class, 'watchlist_collection_id');
    }
}
