import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

import AppLayout from '@/layouts/app-layout';

import { edit as seasonsEdit, index as seasonsIndex } from '@/routes/seasons';

type Props = {
    media: { id: number; title: string };
    seasons: Array<{ id: number; number: number; episodes_count: number }>;
};

export default function SeasonsIndex({ media, seasons }: Props) {
    return (
        <AppLayout>
            <Head title={`Saisons — ${media.title}`} />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Saisons de {media.title}</h1>

                <Link href={seasonsIndex(media.id).url}>
                    <Button variant="outline">Actualiser</Button>
                </Link>
            </div>

            <div className="space-y-4">
                {seasons.map((season) => (
                    <div
                        key={season.id}
                        className="border rounded p-4 flex justify-between"
                    >
                        <div>
                            <div className="font-semibold">Saison {season.number}</div>
                            <div className="text-muted-foreground text-sm">
                                {season.episodes_count} épisodes
                            </div>
                        </div>

                        <Link href={seasonsEdit(media.id, season.id).url}>
                            <Button variant="outline">Modifier</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
