<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Vérifier les user_ids des médias
$mediaWithUserIds = \App\Models\Media::selectRaw('user_id, COUNT(*) as count')
    ->groupBy('user_id')
    ->get();

echo "Media distribution by user_id:\n";
foreach ($mediaWithUserIds as $item) {
    echo "- user_id = " . ($item->user_id ?? 'null') . ": " . $item->count . " medias\n";
}

// Si la majorité ont user_id, il faut les modifier
$countWithUserId = \App\Models\Media::whereNotNull('user_id')->count();
$countNull = \App\Models\Media::whereNull('user_id')->count();

echo "\nTotal with user_id: " . $countWithUserId . "\n";
echo "Total with null user_id: " . $countNull . "\n";

