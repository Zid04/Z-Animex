import { Head, Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import { update as seasonsUpdate } from '@/routes/seasons';

type Props = {
    media: { id: number; title: string };
    season: { id: number; number: number };
};

export default function SeasonEdit({ media, season }: Props) {
    return (
        <AppLayout>
            <Head title={`Modifier saison ${season.number} — ${media.title}`} />

            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">
                    Modifier la saison {season.number}
                </h1>

                <Form
                    {...seasonsUpdate.form(media.id, season.id)}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="number">Numéro de saison</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    type="number"
                                    defaultValue={season.number}
                                    required
                                />
                                <InputError message={errors.number} />
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
