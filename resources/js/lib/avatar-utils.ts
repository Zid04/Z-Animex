/**
 * Utility functions for handling avatar paths
 * Normalizes avatar paths to work correctly with storage
 */

export function getAvatarUrl(avatarPath: string | null | undefined): string | undefined {
    if (!avatarPath) return undefined;

    // Remove any leading slashes for normalization
    const normalized = avatarPath.replace(/^\/+/, '');

    // Check if it's a default avatar
    if (normalized.startsWith('avatars/defaults/')) {
        // Extract filename
        const filename = normalized.replace('avatars/defaults/', '');
        // Return absolute URL from root - MUST start with /
        return `/avatars/defaults/${filename}`;
    }

    // Otherwise it's an uploaded avatar in storage
    return `/storage/${normalized}`;
}
