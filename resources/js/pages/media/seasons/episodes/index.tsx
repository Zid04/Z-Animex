import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

import AppLayout from '@/layouts/app-layout';

import { edit as episodesEdit } from '@/routes/episodes';

type Props = {
    media: { id: number; title: string };
    season: { id: number; number: number };
    episodes: Array<{ id: number; number: number; title?: string }>;
};

export default function EpisodesIndex({ media, season, episodes }: Props) {
    return (
        <AppLayout>
            <Head title={`Saison ${season.number} — ${media.title}`} />

            <h1 className="text-2xl font-semibold mb-6">
                Épisodes — Saison {season.number}
            </h1>

            <div className="space-y-4">
                {episodes.map((ep) => (
                    <div key={ep.id} className="border rounded p-4 flex justify-between">
                        <div>
                            <div className="font-semibold">Épisode {ep.number}</div>
                            {ep.title && (
                                <div className="text-muted-foreground text-sm">{ep.title}</div>
                            )}
                        </div>

                        <Link href={episodesEdit(media.id, season.id, ep.id).url}>
                            <Button variant="outline">Modifier</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
