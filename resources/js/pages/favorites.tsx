import { Head, Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { show } from '@/routes/media';

type Props = {
    favorites: {
        data: Array<{
            id: number;
            media_id: number;
            media: {
                id: number;
                title: string;
                type: string;
                year?: number;
                cover?: string;
            };
        }>;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
};

export default function FavoritesPage({ favorites }: Props) {
    return (
        <AppLayout>
            <Head title="Mes favoris" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                    <h1 className="text-2xl font-semibold">Mes favoris</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    {favorites.data.length} favori{favorites.data.length > 1 ? 's' : ''}
                </p>
            </div>

            {favorites.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Heart className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">Vous n'avez pas encore de favoris</p>
                    <Link href="/media">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">
                            Découvrir des médias
                        </button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Grille */}
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
                        {favorites.data.map((favorite) => {
                            const media = favorite.media;
                            return (
                                <Link key={media.id} href={show(media.id).url}>
                                    <div className="border rounded-lg overflow-hidden hover:shadow transition cursor-pointer">
                                        {media.cover && (
                                            <img
                                                src={media.cover.startsWith('http') ? media.cover : `/storage/${media.cover}`}
                                                alt={media.title}
                                                className="h-48 w-full object-cover"
                                            />
                                        )}

                                        <div className="p-3">
                                            <div className="text-sm uppercase text-muted-foreground">
                                                {media.type}
                                            </div>

                                            <div className="font-semibold">{media.title}</div>

                                            {media.year && (
                                                <div className="text-xs text-muted-foreground">
                                                    {media.year}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-1">
                        {favorites.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-2 rounded text-sm ${
                                    link.active
                                        ? 'bg-primary text-white'
                                        : link.url
                                            ? 'bg-muted hover:bg-secondary'
                                            : 'text-muted-foreground cursor-not-allowed'
                                }`}
                            >
                                {link.label.replace(/&laquo;|&raquo;/g, (match) =>
                                    match === '&laquo;' ? '‹' : '›'
                                )}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </AppLayout>
    );
}
