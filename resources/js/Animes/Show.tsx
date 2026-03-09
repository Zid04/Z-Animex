import { Link, usePage } from '@inertiajs/react';
import animes from '../../routes/animes';

type Genre = {
    mal_id: number;
    name: string;
};

type Studio = {
    mal_id: number;
    name: string;
};

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
    episodes: number | null;
    duration: string | null;
    status: string | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    genres: Genre[];
    studios: Studio[];
};

type PageProps = {
    anime: Anime;
};

export default function Show() {
    const { props } = usePage<PageProps>();
    const { anime } = props;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Link
                href={animes.index.url()}
                className="text-sm text-neutral-400 hover:text-neutral-200"
            >
                ← Retour au catalogue
            </Link>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
                <div>
                    <img
                        src={
                            anime.images?.jpg?.large_image_url ??
                            anime.images?.jpg?.image_url
                        }
                        alt={anime.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>

                    <p className="text-sm text-neutral-400 mb-4">
                        {anime.type ?? '—'} • {anime.year ?? '—'} •{' '}
                        {anime.episodes ?? '?'} épisodes
                    </p>

                    <div className="flex flex-wrap gap-3 mb-4 text-sm">
                        {anime.score && (
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400">
                                ⭐ {anime.score}
                            </span>
                        )}
                        {anime.status && (
                            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-200">
                                {anime.status}
                            </span>
                        )}
                        {anime.duration && (
                            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-200">
                                {anime.duration}
                            </span>
                        )}
                    </div>

                    {anime.genres?.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-sm font-semibold text-neutral-300 mb-1">
                                Genres
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {anime.genres.map((genre) => (
                                    <span
                                        key={genre.mal_id}
                                        className="px-2 py-1 rounded bg-neutral-800 text-xs text-neutral-100"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {anime.studios?.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-sm font-semibold text-neutral-300 mb-1">
                                Studio
                            </h2>
                            <p className="text-sm text-neutral-200">
                                {anime.studios.map((s) => s.name).join(', ')}
                            </p>
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-400">
                        <div>
                            <p className="text-neutral-500">Popularité</p>
                            <p>{anime.popularity ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-neutral-500">Membres</p>
                            <p>{anime.members ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-neutral-500">Favoris</p>
                            <p>{anime.favorites ?? '—'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
