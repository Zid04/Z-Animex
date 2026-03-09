<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::first();

if ($user) {
    echo "User: " . $user->email . "\n";
    echo "Watchlist items (default): " . $user->watchlist()->whereNull('watchlist_collection_id')->count() . "\n";
    echo "Watchlist collections: " . $user->watchlistCollections()->count() . "\n";
    
    // Affiche aussi les relations
    echo "\nCollections:\n";
    foreach ($user->watchlistCollections as $collection) {
        echo "- " . $collection->title . " (" . $collection->watchlists()->count() . " items)\n";
    }
} else {
    echo "No users found\n";
}
