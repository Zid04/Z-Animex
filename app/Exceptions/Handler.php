<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // Gérer les erreurs HTTP
        if ($exception instanceof HttpException) {
            $status = $exception->getStatusCode();

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => $exception->getMessage(),
                    'status' => $status,
                ], $status);
            }

            // Pages Inertia pour les erreurs
            if ($status === 401) {
                return Inertia::render('errors/401', [
                    'message' => 'Vous devez être connecté pour accéder à cette ressource.',
                ]);
            }

            if ($status === 403) {
                return Inertia::render('errors/403', [
                    'message' => 'Vous n\'avez pas accès à cette ressource.',
                ]);
            }

            if ($status === 404) {
                return Inertia::render('errors/404', [
                    'message' => 'La page que vous recherchez n\'existe pas ou a été supprimée.',
                ]);
            }

            if ($status === 419) {
                return Inertia::render('errors/419', [
                    'message' => 'Cette session a expiré. Veuillez recharger la page et réessayer.',
                ]);
            }

            if ($status === 500) {
                return Inertia::render('errors/500', [
                    'message' => 'Une erreur s\'est produite lors du traitement de votre demande.',
                ]);
            }

            if ($status === 429) {
                return Inertia::render('errors/429', [
                    'message' => 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
                ]);
            }
        }

        // Erreur server générique
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Erreur serveur interne',
                'status' => 500,
            ], 500);
        }

        return Inertia::render('errors/500', [
            'message' => 'Une erreur s\'est produite lors du traitement de votre demande.',
        ]);
    }
}
