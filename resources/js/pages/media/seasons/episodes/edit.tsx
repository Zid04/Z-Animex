import { Head, Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import { update as episodesUpdate } from '@/routes/episodes';

type Props = {
    media: { id: number; title: string };
    season: { id: number; number: number };
    episode: { id: number; number: number; title?: string };
};

export default function EpisodeEdit({ media, season, episode }: Props) {
    return (
        <AppLayout>
            <Head title={`Modifier épisode ${episode.number}`} />

            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">
                    Modifier épisode {episode.number} — Saison {season.number}
                </h1>

                <Form
                    {...episodesUpdate.form(media.id, season.id, episode.id)}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="number">Numéro d'épisode</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    type="number"
                                    defaultValue={episode.number}
                                    required
                                />
                                <InputError message={errors.number} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Titre</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    defaultValue={episode.title ?? ''}
                                />
                                <InputError message={errors.title} />
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
