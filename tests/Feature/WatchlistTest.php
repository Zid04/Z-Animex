<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Watchlist;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WatchlistTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_add_to_watchlist()
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();

        $this->actingAs($user);

        // Route correcte : watchlist.store.media
        $response = $this->post(route('watchlist.store.media', $media));

        $response->assertRedirect();

        $this->assertDatabaseHas('watchlists', [
            'user_id' => $user->id,
            'media_id' => $media->id,
        ]);
    }

    public function test_user_can_remove_from_watchlist()
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();

        Watchlist::create([
            'user_id' => $user->id,
            'media_id' => $media->id,
        ]);

        $this->actingAs($user);

        $response = $this->delete(route('watchlist.destroy', $media));

        $response->assertRedirect();

        $this->assertDatabaseMissing('watchlists', [
            'user_id' => $user->id,
            'media_id' => $media->id,
        ]);
    }

    public function test_user_cannot_remove_other_users_watchlist()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $media = Media::factory()->create();

        Watchlist::create([
            'user_id' => $user2->id,
            'media_id' => $media->id,
        ]);

        $this->actingAs($user1);

        $response = $this->delete(route('watchlist.destroy', $media));

        $response->assertStatus(403);
    }

    public function test_user_can_view_watchlist()
    {
        $user = User::factory()->create();
        $media1 = Media::factory()->create();
        $media2 = Media::factory()->create();

        Watchlist::create([
            'user_id' => $user->id,
            'media_id' => $media1->id,
        ]);

        Watchlist::create([
            'user_id' => $user->id,
            'media_id' => $media2->id,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('watchlist.index'));

        $response->assertOk();
    }

    public function test_user_can_view_their_watchlists()
    {
        $user = User::factory()->create();

        Watchlist::factory()->count(2)->create([
            'user_id' => $user->id,
            'media_id' => Media::factory(),
        ]);

        $this->actingAs($user);

        $response = $this->get(route('watchlist.index'));

        $response->assertOk();
    }
}
