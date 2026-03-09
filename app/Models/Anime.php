<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    protected $fillable = [
        'mal_id',
        'title',
        'images',
        'approved',
        'type',
        'source',
        'episodes',
        'status',
        'airing',
        'duration',
        'score',
        'scored_by',
        'rank',
        'popularity',
        'members',
        'favorites',
        'year',
        'studios',
        'genres',
    ];

    protected $casts = [
        'images' => 'array',
        'studios' => 'array',
        'genres' => 'array',
        'approved' => 'boolean',
        'airing' => 'boolean',
        'episodes' => 'integer',
        'year' => 'integer',
        'score' => 'float',
    ];
}
