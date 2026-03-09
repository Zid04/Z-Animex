import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { show } from '@/routes/media';

type Season = {
    id: number;
    number: number;
    episodes: {
        id: number;
        number: number;
        title: string;
        watched: boolean;
    }[];
};

type Props = {
    media: {
        id: number;
        title: string;
        description?: string;
        type: string;
        year?: number;
        cover?: string;
        user_id: number;
        user?: {
            id: number;
            name: string;
        };
    };
    seasons: Season[];
};

export default function MediaSeasons({ media, seasons }: Props) {
    return (
        <AppLayout>
            <Head title={`${media.title} - Saisons`} />

            <div className="max-w-4xl mx-auto py-6 px-4">
                {/* Header avec retour */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={show(media.id).url}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{media.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                {media.type} • {media.year && `${media.year} •`} {seasons.length} saison{seasons.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Saisons et épisodes */}
                <div className="space-y-8">
                    {seasons.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Aucune saison disponible</p>
                        </div>
                    ) : (
                        seasons.map((season) => (
                            <div key={season.id} className="border rounded-lg p-6">
                                <h2 className="text-2xl font-bold mb-4">Saison {season.number}</h2>

                                <div className="space-y-2">
                                    {season.episodes.length === 0 ? (
                                        <p className="text-muted-foreground">Aucun épisode</p>
                                    ) : (
                                        season.episodes.map((episode) => (
                                            <div
                                                key={episode.id}
                                                className="flex items-center gap-4 p-3 hover:bg-muted rounded-md transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        Épisode {episode.number}: {episode.title}
                                                    </p>
                                                </div>
                                                {episode.watched && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        Regardé
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
