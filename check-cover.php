<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('email', 'test@example.com')->first();
if (!$user) {
    $user = \App\Models\User::first();
}

if (!$user) {
    echo "No users found\n";
    exit;
}

// Créer 2 collections de test
\App\Models\WatchlistCollection::create([
    'user_id' => $user->id,
    'title' => 'À regarder en été',
    'description' => 'Animes pour l\'été prochain',
]);

\App\Models\WatchlistCollection::create([
    'user_id' => $user->id,
    'title' => 'Favoris', 
    'description' => 'Mes animes préférés',
]);

echo "Collections créées!\n";

// Afficher les collections
$collections = \App\Models\WatchlistCollection::where('user_id', $user->id)->get();
foreach ($collections as $col) {
    echo "- " . $col->title . "\n";
}





