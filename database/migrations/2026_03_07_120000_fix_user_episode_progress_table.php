<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_episode_progress', function (Blueprint $table) {
            // Ajouter user_id s'il n'existe pas
            if (!Schema::hasColumn('user_episode_progress', 'user_id')) {
                $table->foreignId('user_id')->constrained()->cascadeOnDelete()->after('id');
            }
            
            // Supprimer les colonnes inutiles si elles existent
            if (Schema::hasColumn('user_episode_progress', 'media_id')) {
                $table->dropForeign(['media_id']);
                $table->dropColumn('media_id');
            }
            
            if (Schema::hasColumn('user_episode_progress', 'season_id')) {
                $table->dropForeign(['season_id']);
                $table->dropColumn('season_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('user_episode_progress', function (Blueprint $table) {
            if (Schema::hasColumn('user_episode_progress', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
            
            if (!Schema::hasColumn('user_episode_progress', 'media_id')) {
                $table->foreignId('media_id')->constrained()->cascadeOnDelete();
            }
            
            if (!Schema::hasColumn('user_episode_progress', 'season_id')) {
                $table->foreignId('season_id')->constrained()->cascadeOnDelete();
            }
        });
    }
};
