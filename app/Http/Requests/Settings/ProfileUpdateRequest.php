<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'max:255'],
            'email'  => ['required', 'string', 'email', 'max:255'],
            'pseudo' => ['required', 'string', 'max:255'],

            // Avatar : accepte string OU fichier image
            'avatar' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    //  Si avatar prédéfini (string)
                    if (is_string($value)) {
                        // Nettoyer et normaliser
                        $clean = ltrim($value, '/');
                        if (!str_starts_with($clean, 'avatars/defaults/')) {
                            $fail('Invalid avatar selected.');
                        }
                        return;
                    }

                    //  Si avatar uploadé (fichier)
                    if ($value instanceof \Illuminate\Http\UploadedFile) {
                        if (!$value->isValid()) {
                            $fail('Invalid image upload.');
                        }

                        // Vérification du type MIME
                        $allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
                        if (!in_array($value->getMimeType(), $allowed)) {
                            $fail('The avatar must be a valid image (png, jpg, webp, avif).');
                        }

                        return;
                    }

                    //  Sinon → erreur
                    if (!is_null($value)) {
                        $fail('The avatar field must be an image or a valid predefined avatar.');
                    }
                }
            ],
        ];
    }
}
