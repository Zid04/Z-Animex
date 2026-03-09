<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name'   => $this->nameRules(),
            'email'  => $this->emailRules($userId),
            'pseudo' => $this->pseudoRules($userId),
            'avatar' => $this->avatarRules(),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * Get the validation rules used to validate user pseudo.
     */
    protected function pseudoRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'max:255',
            $userId === null
                ? Rule::unique(User::class, 'pseudo')
                : Rule::unique(User::class, 'pseudo')->ignore($userId),
        ];
    }

    /**
     * Get the validation rules used to validate user avatar.
     */
    protected function avatarRules(): array
    {
        return [
            'nullable',
            'image',
            'max:2048', 
            'mimes:jpg,jpeg,png,webp',
        ];
    }
}
