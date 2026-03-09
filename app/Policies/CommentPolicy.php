<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    /**
     * Détermine si l'utilisateur peut mettre à jour le commentaire.
     * Seul l'auteur du commentaire peut le modifier.
     */
    public function update(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id;
    }

    /**
     * Détermine si l'utilisateur peut supprimer le commentaire.
     * Seul l'auteur du commentaire peut le supprimer.
     */
    public function delete(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id;
    }
}
