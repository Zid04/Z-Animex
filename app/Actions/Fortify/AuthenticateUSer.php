<?php

namespace App\Actions\Fortify;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateUser
{
    public function authenticate(Request $request)
    {
        $login = $request->input('email');

        // Détecter si c’est un email ou un pseudo
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'pseudo';


        // Tentative de connexion
        if (! Auth::attempt([
            $field => $login,
            'password' => $request->password,
        ], $request->boolean('remember'))) {
            return false;
        }

        return Auth::user();
    }
}
