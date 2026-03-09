<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Tests fonctionnels pour l'authentification et les permissions
 * Vérifie la connexion, l'inscription et l'accès aux ressources protégées
 */
class DashboardAuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que la page de connexion est accessible
     */
    public function test_login_page_is_accessible()
    {
        $response = $this->get('/login');
        
        $response->assertStatus(200);
    }

    /**
     * Test que la page d'inscription est accessible
     */
    public function test_registration_page_is_accessible()
    {
        $response = $this->get('/register');
        
        $response->assertStatus(200);
    }

    /**
     * Test qu'un utilisateur peut se connecter avec des identifiants valides
     */
    public function test_user_can_login_with_valid_credentials()
    {
        // Créer un utilisateur
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Essayer de se connecter
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        // Vérifier que l'utilisateur est connecté
        $this->assertAuthenticated();
    }

    /**
     * Test qu'un utilisateur ne peut pas se connecter avec des identifiants invalides
     */
    public function test_user_cannot_login_with_invalid_credentials()
    {
        // Créer un utilisateur
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Essayer de se connecter avec un mauvais mot de passe
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong_password',
        ]);

        // Vérifier que l'utilisateur n'est pas connecté
        $this->assertGuest();
    }

    /**
     * Test qu'un utilisateur peut se déconnecter
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        
        // Se connecter
        $this->actingAs($user);
        $this->assertAuthenticated();

        // Se déconnecter
        $response = $this->post('/logout');

        // Vérifier que l'utilisateur est déconnecté
        $this->assertGuest();
    }

    /**
     * Test que les ressources protégées nécessitent l'authentification
     */
    public function test_protected_routes_require_authentication()
    {
        // Essayer d'accéder aux médias sans authentification
        $response = $this->get(route('media.index'));

        // Vérifier qu'on est redirigé vers la connexion
        $response->assertStatus(401);
    }

    /**
     * Test qu'un utilisateur authentifié peut accéder aux ressources protégées
     */
    public function test_authenticated_user_can_access_protected_routes()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Essayer d'accéder à la page des médias
        $response = $this->get(route('media.index'));

        // Vérifier qu'on peut accéder (200 ou autres codes OK)
        $this->assertNotEquals(401, $response->getStatusCode());
    }

    /**
     * Test qu'un nouveau pseudo doit être unique lors de l'inscription
     */
    public function test_pseudo_must_be_unique()
    {
        // Créer un utilisateur avec un pseudo
        User::factory()->create([
            'pseudo' => 'unique_username',
            'email' => 'user1@example.com',
        ]);

        // Essayer d'enregistrer un nouvel utilisateur avec le même pseudo
        // Cela dépend de votre logique d'inscription
        // Mais la contrainte de base est vérifiée dans le modèle
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'name' => 'Another User',
            'pseudo' => 'unique_username',
            'email' => 'user2@example.com',
            'password' => bcrypt('password123'),
        ]);
    }
}
