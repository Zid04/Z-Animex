<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Tests fonctionnels de base pour l'accueil de l'application
 * Vérifie que les pages publiques sont accessibles
 */
class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que la page d'accueil répond avec succès
     */
    public function test_returns_a_successful_response()
    {
        // Accéder à la page d'accueil
        $response = $this->get(route('home'));

        // Vérifier que la réponse est 200 OK
        $response->assertOk();
    }

    /**
     * Test que la page d'accueil contient le formulaire d'inscription
     */
    public function test_home_page_shows_registration_form()
    {
        $response = $this->get(route('home'));

        // Vérifier que le component 'welcome' est rendu
        $response->assertStatus(200);
    }
}
