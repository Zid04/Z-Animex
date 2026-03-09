import { Head, Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import { store as seasonsStore } from '@/routes/seasons';

type Props = {
    media: { id: number; title: string };
};

export default function SeasonCreate({ media }: Props) {
    return (
        <AppLayout>
            <Head title={`Ajouter une saison — ${media.title}`} />

            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">
                    Ajouter une saison à {media.title}
                </h1>

                <Form
                    {...seasonsStore.form(media.id)}
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
                                    required
                                />
                                <InputError message={errors.number} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Création…' : 'Créer la saison'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
