import { Head, Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import { store as episodesStore } from '@/routes/episodes';

type Props = {
    media: { id: number; title: string };
    season: { id: number; number: number };
};

export default function EpisodeCreate({ media, season }: Props) {
    return (
        <AppLayout>
            <Head title={`Ajouter un épisode — Saison ${season.number}`} />

            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">
                    Ajouter un épisode — Saison {season.number}
                </h1>

                <Form
                    {...episodesStore.form(media.id, season.id)}
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
                                    required
                                />
                                <InputError message={errors.number} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Titre (optionnel)</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Création…' : 'Créer l’épisode'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
