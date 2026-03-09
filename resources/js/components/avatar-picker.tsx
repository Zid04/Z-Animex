import React from "react";
import { getAvatarUrl } from "@/lib/avatar-utils";

interface AvatarPickerProps {
    value: string | File | null;
    onChange: (value: string | File | null) => void;
}

const defaultAvatars = [
    "avatars/defaults/avatar-1.avif",
    "avatars/defaults/avatar-2.png",
    "avatars/defaults/avatar-3.png",
    "avatars/defaults/avatar-4.webp",
    "avatars/defaults/avatar-5.jpg",
    "avatars/defaults/avatar-6.webp",
    "avatars/defaults/avatar-7.avif",
    "avatars/defaults/avatar-8.jpg",
    "avatars/defaults/avatar-9.jpg",
    "avatars/defaults/avatar-10.png",
    "avatars/defaults/avatar-11.jpg",
    "avatars/defaults/avatar-12.avif",
];

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
    // Normalize value for comparison
    const normalizedValue = value instanceof File ? null : value?.replace(/^\/+/, '');

    return (
        <div className="space-y-4">
            <p className="text-sm font-medium">Choose an avatar</p>

            <div className="grid grid-cols-6 gap-4">
                {defaultAvatars.map((avatarPath) => {
                    const displayUrl = getAvatarUrl(avatarPath);
                    return (
                        <img
                            key={avatarPath}
                            src={displayUrl || undefined}
                            alt="avatar option"
                            onClick={() => onChange(avatarPath)}
                            className={`h-16 w-16 rounded-full cursor-pointer border-2 object-cover transition
                                ${normalizedValue === avatarPath ? "border-blue-500 scale-105" : "border-transparent hover:scale-105"}`}
                        />
                    );
                })}
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium mb-2">Or upload your own</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                />
            </div>
        </div>
    );
}