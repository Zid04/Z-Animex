import { Head, Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import { update } from '@/routes/media';

type Props = {
    media: {
        id: number;
        title: string;
        description?: string;
        type: string;
        year?: number;
        visibility: string;
        cover?: string;
    };
};

export default function MediaEdit({ media }: Props) {
    return (
        <AppLayout>
            <Head title={`Modifier : ${media.title}`} />

            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">Modifier le média</h1>

                <Form
                    {...update.form(media.id)}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={media.title}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={media.description}
                                    className="border rounded p-2 w-full min-h-[120px]"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="year">Année</Label>
                                <Input
                                    id="year"
                                    name="year"
                                    type="number"
                                    defaultValue={media.year ?? ''}
                                />
                                <InputError message={errors.year} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue={media.type}
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="anime">Anime</option>
                                    <option value="movie">Film</option>
                                    <option value="series">Série</option>
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visibility">Visibilité</Label>
                                <select
                                    id="visibility"
                                    name="visibility"
                                    defaultValue={media.visibility}
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Privé</option>
                                </select>
                                <InputError message={errors.visibility} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover">Nouvelle image (optionnel)</Label>
                                <Input
                                    id="cover"
                                    name="cover"
                                    type="file"
                                    accept="image/*"
                                />
                                <InputError message={errors.cover} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Mise à jour…' : 'Mettre à jour'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
