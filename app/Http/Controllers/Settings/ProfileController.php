<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        /**
         * AVATAR LOGIC
         * - Si avatar = string → avatar prédéfini
         * - Si avatar = file → upload
         */

        if (isset($validated['avatar']) && is_string($validated['avatar'])) {

            // Si l'ancien avatar était un upload, on le supprime
            if ($user->avatar && !str_starts_with($user->avatar, 'avatars/defaults/')) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Stocker le chemin de l'avatar prédéfini (toujours sans leading slash)
            $validated['avatar'] = ltrim($validated['avatar'], '/');
        }

        elseif ($request->hasFile('avatar')) {

            // Supprimer l'ancien avatar si ce n'est pas un avatar prédéfini
            if ($user->avatar && !str_starts_with($user->avatar, 'avatars/defaults/')) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Upload du nouvel avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        } else {
            // Normaliser l'avatar existant en case de doublure de slash
            if (isset($user->avatar)) {
                $validated['avatar'] = ltrim($user->avatar, '/');
            }
        }

        // Reset email verification if email changed
        if ($user->email !== $validated['email']) {
            $validated['email_verified_at'] = null;
        }

        // Update user
        $user->update($validated);

        // Redirect Inertia-friendly
        return back(303)->with('status', 'Profile updated successfully.');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar && !str_starts_with($user->avatar, 'avatars/defaults/')) {
            Storage::disk('public')->delete($user->avatar);
        }

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
