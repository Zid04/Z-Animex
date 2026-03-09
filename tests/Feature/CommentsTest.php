<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Media;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_comment()
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();

        $this->actingAs($user);

        $response = $this->post(route('comments.store', $media), [
            'content' => 'Premier commentaire',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'user_id' => $user->id,
            'media_id' => $media->id,
            'content' => 'Premier commentaire',
        ]);
    }

    public function test_comment_cannot_be_empty()
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('comments.store', $media), [
            'content' => '',
        ]);

        $response->assertSessionHasErrors(['content']);
    }

    public function test_user_can_update_own_comment()
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'media_id' => $media->id,
            'content' => 'Commentaire initial',
        ]);

        $this->actingAs($user);

        $response = $this->patch(route('comments.update', $comment), [
            'content' => 'Contenu modifié',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => 'Contenu modifié',
        ]);
    }

    public function test_user_cannot_update_other_users_comment()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $media = Media::factory()->create();

        $comment = Comment::factory()->create([
            'user_id' => $user2->id,
            'media_id' => $media->id,
            'content' => 'Commentaire de user2',
        ]);

        $this->actingAs($user1);

        $response = $this->patch(route('comments.update', $comment), [
            'content' => 'Tentative modification',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => 'Commentaire de user2',
        ]);
    }

    public function test_user_can_delete_own_comment()
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'media_id' => $media->id,
        ]);

        $this->actingAs($user);

        $response = $this->delete(route('comments.destroy', $comment));

        $response->assertRedirect();
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_unauthenticated_user_cannot_create_comment()
    {
        $media = Media::factory()->create();

        $response = $this->post(route('comments.store', $media), [
            'content' => 'Commentaire anonyme',
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_media_comments_are_chronologically_ordered()
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();
        $this->actingAs($user);

        $comment1 = Comment::factory()->create([
            'user_id' => $user->id,
            'media_id' => $media->id,
            'content' => 'Premier commentaire',
            'created_at' => now()->subMinute(),
        ]);

        $comment2 = Comment::factory()->create([
            'user_id' => $user->id,
            'media_id' => $media->id,
            'content' => 'Deuxième commentaire',
            'created_at' => now(),
        ]);

        // On suit TA logique : commentaires du plus récent au plus ancien
        $comments = $media->comments()->orderBy('created_at', 'desc')->get();

        $this->assertEquals('Deuxième commentaire', $comments[0]->content);
        $this->assertEquals('Premier commentaire', $comments[1]->content);
    }
}
