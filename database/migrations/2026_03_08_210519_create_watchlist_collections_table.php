<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('watchlist_collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Ajouter la colonne watchlist_collection_id à la table watchlist
        Schema::table('watchlists', function (Blueprint $table) {
            $table->foreignId('watchlist_collection_id')->nullable()->constrained('watchlist_collections')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('watchlists', function (Blueprint $table) {
            $table->dropForeignIdFor('watchlist_collections');
            $table->dropColumn('watchlist_collection_id');
        });
        Schema::dropIfExists('watchlist_collections');
    }
};
