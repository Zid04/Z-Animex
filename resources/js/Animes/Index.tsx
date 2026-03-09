import { Link, usePage } from '@inertiajs/react';
import animes from '../../routes/animes';

type AnimeImageSet = {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
};

type AnimeImages = {
    jpg: AnimeImageSet;
    webp?: AnimeImageSet;
};

type Anime = {
    id: number;
    title: string;
    images: AnimeImages;
    score: number | null;
    year: number | null;
    type: string | null;
};

type PageProps = {
    animes: Anime[];
};

export default function Index() {
    const { props } = usePage<PageProps>();
    const { animes: list } = props;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Catalogue d'animes</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {list.map((anime) => (
                    <Link
                        key={anime.id}
                        href={animes.show.url(anime.id)}
                        className="group"
                    >
                        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-neutral-900">
                            <img
                                src={anime.images?.jpg?.image_url}
                                alt={anime.title}
                                className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                        </div>

                        <div className="mt-2">
                            <p className="text-sm font-semibold line-clamp-2">
                                {anime.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                                {anime.type ?? '—'} • {anime.year ?? '—'}
                            </p>
                            {anime.score && (
                                <p className="text-xs text-amber-400 mt-1">
                                    ⭐ {anime.score}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
