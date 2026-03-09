// Imports externes
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Imports absolus (alias @)
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { getAvatarUrl } from '@/lib/avatar-utils';
import { update } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: update().url,
    },
];

// AVATARS PRÉDÉFINIS EXACTS
const defaultAvatars = [
    "/avatars/defaults/avatar-1.avif",
    "/avatars/defaults/avatar-2.png",
    "/avatars/defaults/avatar-3.png",
    "/avatars/defaults/avatar-4.webp",
    "/avatars/defaults/avatar-5.jpg",
    "/avatars/defaults/avatar-6.webp",
    "/avatars/defaults/avatar-7.avif",
    "/avatars/defaults/avatar-8.jpg",
    "/avatars/defaults/avatar-9.jpg",
    "/avatars/defaults/avatar-10.png",
    "/avatars/defaults/avatar-11.jpg",
    "/avatars/defaults/avatar-12.avif",
];

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({ mustVerifyEmail, status }: ProfileProps) {
    const { auth } = usePage().props as any;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name ?? "",
        email: auth.user.email ?? "",
        pseudo: auth.user.pseudo ?? "",
        avatar: null as File | string | null,
    });

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
        auth.user.avatar ?? null
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();

        patch(update().url, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name, email, pseudo and avatar"
                    />

                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">

                        {/* NAME */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        {/* EMAIL */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {/* PSEUDO */}
                        <div className="grid gap-2">
                            <Label htmlFor="pseudo">Pseudo</Label>

                            <Input
                                id="pseudo"
                                name="pseudo"
                                value={data.pseudo}
                                onChange={(e) => setData('pseudo', e.target.value)}
                                required
                            />

                            <InputError className="mt-2" message={errors.pseudo} />
                        </div>

                        {/* AVATAR PICKER */}
                        <div className="grid gap-2">
                            <Label>Choose an avatar</Label>

                            <div className="grid grid-cols-6 gap-4">
                                {defaultAvatars.map((url) => (
                                    <img
                                        key={url}
                                        src={url}
                                        onClick={() => {
                                            setSelectedAvatar(url);
                                            setData("avatar", url);
                                        }}
                                        className={`h-16 w-16 rounded-full cursor-pointer border-2 object-cover transition
                                            ${selectedAvatar === url
                                                ? "border-blue-500 scale-105"
                                                : "border-transparent hover:scale-105"
                                            }`}
                                    />
                                ))}
                            </div>

                            <Label className="mt-4">Or upload your own</Label>

                            <Input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setSelectedAvatar(null);
                                    setData("avatar", file);
                                }}
                            />

                            <InputError className="mt-2" message={errors.avatar} />

                            {/* AVATAR PREVIEW */}
                            {auth.user.avatar && (
                                <img
                                    src={getAvatarUrl(auth.user.avatar) || '/default-avatar.png'}
                                    alt="Avatar"
                                    className="mt-4 h-20 w-20 rounded-full object-cover"
                                />
                            )}
                        </div>

                        {/* EMAIL VERIFICATION */}
                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={send().url}
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SAVE BUTTON */}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>

                            {(recentlySuccessful || status) && (
                                <p className="text-sm text-green-600">
                                    {status ?? 'Saved'}
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
