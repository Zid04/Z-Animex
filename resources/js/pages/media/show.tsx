import { Head, Link, Form } from '@inertiajs/react';
import React, { useState } from 'react';

import { EpisodeProgressCheckbox } from '@/components/episode-progress-checkbox';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WatchlistSelector } from '@/components/watchlist-selector';
import AppLayout from '@/layouts/app-layout';

import { store as commentsStore, destroy as commentsDestroy } from '@/routes/comments';
import { store as episodeStore, destroy as episodeDestroy } from '@/routes/episodes';
import { store as favoriteStore, destroy as favoriteDestroy } from '@/routes/favorites';
import { edit, destroy } from '@/routes/media';
import { store as progressStore, destroy as progressDestroy } from '@/routes/progress';
import { store as ratingStore, update as ratingUpdate, destroy as ratingDestroy } from '@/routes/ratings';
import { store as seasonStore } from '@/routes/seasons';
import { attach as tagsAttach, detach as tagsDetach } from '@/routes/tags';
import { destroy as watchlistDestroy } from '@/routes/watchlist';

type WatchlistCollection = {
    id: number;
    title: string;
    description?: string | null;
};

type Props = {
    media: {
        id: number;
        title: string;
        description?: string;
        type: string;
        year?: number;
        visibility: string;
        cover?: string;
        user?: {
            id: number;
            name: string;
        };

        user_rating?: number | null;
        is_favorite?: boolean;
        is_in_watchlist?: boolean;
        average_rating?: number | null;
        progress_percentage?: number;

        comments: {
            id: number;
            content: string;
            user_id: number;
            user: { id: number; name: string };
        }[];

        tags: {
            id: number;
            name: string;
        }[];

        all_tags: {
            id: number;
            name: string;
        }[];

        seasons: {
            id: number;
            number: number;
            title: string;
            episodes: {
                id: number;
                number: number;
                title: string;
                watched: boolean;
            }[];
        }[];
    };
    progress: {
        episodes_total: number;
        episodes_watched: number;
        percent: number;
        seasons: {
            season_id: number;
            number: number;
            episodes_total: number;
            episodes_watched: number;
            percent: number;
        }[];
    };
    watchlist_collections: WatchlistCollection[];
};

export default function MediaShow({ media, progress, watchlist_collections }: Props) {
    const [showAddSeason, setShowAddSeason] = useState(false);
    const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
    const [showAddEpisode, setShowAddEpisode] = useState<number | null>(null);

    return (
        <AppLayout>
            <Head title={media.title} />

            <div className="max-w-3xl mx-auto space-y-10">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">{media.title}</h1>

                    <div className="flex gap-3">
                        <Link href={edit(media.id).url}>
                            <Button variant="outline">Modifier</Button>
                        </Link>

                        <Form {...destroy(media.id)} className="inline-block">
                            {({ processing }) => (
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    Supprimer
                                </Button>
                            )}
                        </Form>
                    </div>
                </div>

                {/* COVER */}
                {media.cover && (
                    <img
                        src={media.cover.startsWith('http') ? media.cover : `/storage/${media.cover}`}
                        alt={media.title}
                        className="w-full max-h-[400px] object-cover rounded-lg"
                    />
                )}

                {/* INFOS */}
                <div className="space-y-4">
                    <p className="text-muted-foreground">
                        <strong>Type :</strong> {media.type}
                    </p>

                    {media.year && (
                        <p className="text-muted-foreground">
                            <strong>Année :</strong> {media.year}
                        </p>
                    )}

                    <p className="text-muted-foreground">
                        <strong>Visibilité :</strong>{' '}
                        {media.visibility === 'public' ? 'Public' : 'Privé'}
                    </p>

                    {media.description && (
                        <p className="leading-relaxed whitespace-pre-line">
                            {media.description}
                        </p>
                    )}
                </div>

                {/* TAGS */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Genres / Tags</h2>

                    <div className="flex gap-2 flex-wrap">
                        {media.tags.map(tag => (
                            <Form key={tag.id} {...tagsDetach.form([media.id, tag.id])}>
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        {tag.name} ✕
                                    </Button>
                                )}
                            </Form>
                        ))}
                    </div>

                    <Form {...tagsAttach.form(media.id)} className="flex gap-3">
                        <select name="tag_id" className="border rounded p-2">
                            {media.all_tags.map(tag => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>

                        <Button type="submit">Ajouter</Button>
                    </Form>
                </div>

                {/* FAVORIS */}
                <div>
                    <Form
                        {...(media.is_favorite
                            ? favoriteDestroy.form(media.id)
                            : favoriteStore.form(media.id)
                        )}
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant={media.is_favorite ? 'destructive' : 'secondary'}
                                disabled={processing}
                            >
                                {media.is_favorite
                                    ? 'Retirer des favoris'
                                    : 'Ajouter aux favoris'}
                            </Button>
                        )}
                    </Form>
                </div>

                {/* WATCHLIST */}
                <div className="flex gap-2">
                    {!media.is_in_watchlist ? (
                        <WatchlistSelector
                            media_id={media.id}
                            collections={watchlist_collections}
                        />
                    ) : (
                        <>
                            <span className="text-sm text-green-600 font-semibold">✓ Dans votre watchlist</span>
                            <Form {...watchlistDestroy.form(media.id)}>
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        size="sm"
                                        disabled={processing}
                                    >
                                        Retirer
                                    </Button>
                                )}
                            </Form>
                        </>
                    )}
                </div>

                {/* RATING */}
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Votre note</h2>

                    <Form
                        {...(media.user_rating
                            ? ratingUpdate.form(media.id)
                            : ratingStore.form(media.id)
                        )}
                        className="flex items-center gap-3"
                    >
                        {({ processing }) => (
                            <>
                                <Input
                                    type="number"
                                    name="rating"
                                    min="1"
                                    max="10"
                                    defaultValue={media.user_rating ?? ''}
                                    className="w-20"
                                />

                                <Button type="submit" disabled={processing}>
                                    Enregistrer
                                </Button>
                            </>
                        )}
                    </Form>

                    {media.user_rating && (
                        <Form {...ratingDestroy.form(media.id)}>
                            {({ processing }) => (
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    Retirer la note
                                </Button>
                            )}
                        </Form>
                    )}

                    {media.average_rating && (
                        <p className="text-muted-foreground text-sm">
                            Note moyenne : {media.average_rating}/10
                        </p>
                    )}
                </div>

                {/* COMMENTAIRES */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Commentaires</h2>

                    {/* Formulaire */}
                    <Form {...commentsStore.form(media.id)} className="space-y-3">
                        {({ processing }) => (
                            <>
                                <textarea
                                    name="content"
                                    className="w-full border rounded p-2"
                                    placeholder="Écrire un commentaire..."
                                />
                                <Button type="submit" disabled={processing}>
                                    Publier
                                </Button>
                            </>
                        )}
                    </Form>

                    {/* Liste */}
                    {media.comments.map(comment => (
                        <div key={comment.id} className="border p-3 rounded space-y-2">
                            <p className="font-semibold">{comment.user.name}</p>
                            <p>{comment.content}</p>

                            {comment.user_id === media.user?.id && (
                                <Form {...commentsDestroy.form(comment.id)}>
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={processing}
                                        >
                                            Supprimer
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </div>
                    ))}
                </div>

                {/* PROGRESSION ET SAISONS */}
                {(media.type === 'series' || media.type === 'anime') && (
                    <div className="space-y-4">
                        {/* Barre de progression globale */}
                        {progress && progress.episodes_total > 0 && (
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Votre Progression</h2>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-200 h-3 rounded overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full transition-all"
                                            style={{ width: `${progress.percent}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold">
                                        {progress.episodes_watched}/{progress.episodes_total}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Gestion des saisons */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Saisons</h2>
                                <Button onClick={() => setShowAddSeason(!showAddSeason)} variant="outline">
                                    {showAddSeason ? 'Annuler' : '+ Ajouter une saison'}
                                </Button>
                            </div>

                            {showAddSeason && (
                                <Form {...seasonStore.form(media.id)} className="border p-4 rounded space-y-3">
                                    {({ processing }) => (
                                        <>
                                            <Input
                                                type="number"
                                                name="number"
                                                placeholder="Numéro de la saison"
                                                min="1"
                                                required
                                            />
                                            <Input
                                                type="text"
                                                name="title"
                                                placeholder="Titre de la saison (optionnel)"
                                            />
                                            <Button type="submit" disabled={processing}>
                                                Créer
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            )}

                        <div className="space-y-3">
                            {media.seasons.length === 0 ? (
                                <p className="text-muted-foreground">Aucune saison pour le moment</p>
                            ) : (
                                media.seasons.map(season => (
                                    <div key={season.id} className="border rounded">
                                        <button
                                            onClick={() => setExpandedSeason(expandedSeason === season.id ? null : season.id)}
                                            className="w-full p-4 text-left hover:bg-gray-50 flex justify-between items-center"
                                        >
                                            <span className="font-semibold">
                                                Saison {season.number}
                                                {season.title && ` - ${season.title}`}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {season.episodes.length} épisode(s)
                                            </span>
                                        </button>

                                        {expandedSeason === season.id && (
                                            <div className="border-t p-4 space-y-3 bg-gray-50">
                                                {/* Formulaire ajouter épisode */}
                                                {showAddEpisode === season.id && (
                                                    <Form
                                                        {...episodeStore.form([media.id, season.id])}
                                                        className="space-y-3 border p-3 rounded bg-white"
                                                    >
                                                        {({ processing }) => (
                                                            <>
                                                                <Input
                                                                    type="number"
                                                                    name="number"
                                                                    placeholder="Numéro de l'épisode"
                                                                    min="1"
                                                                    required
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    name="title"
                                                                    placeholder="Titre de l'épisode"
                                                                    required
                                                                />
                                                                <div className="flex gap-2">
                                                                    <Button type="submit" disabled={processing}>
                                                                        Créer
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => setShowAddEpisode(null)}
                                                                    >
                                                                        Annuler
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </Form>
                                                )}

                                                {/* Liste des épisodes */}
                                                {season.episodes.length > 0 && (
                                                    <div className="space-y-2">
                                                        {season.episodes.map(episode => (
                                                            <div
                                                                key={episode.id}
                                                                className="flex items-center justify-between p-3 bg-white rounded border"
                                                            >
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    <EpisodeProgressCheckbox
                                                                        mediaId={media.id}
                                                                        seasonId={season.id}
                                                                        episodeId={episode.id}
                                                                        watched={episode.watched}
                                                                        storeRoute={progressStore}
                                                                        destroyRoute={progressDestroy}
                                                                    />
                                                                    <span className={episode.watched ? 'line-through text-muted-foreground' : ''}>
                                                                        <strong>Épisode {episode.number}:</strong> {episode.title}
                                                                    </span>
                                                                </div>
                                                                <Form
                                                                    {...episodeDestroy.form([media.id, season.id, episode.id])}
                                                                    className="inline-block"
                                                                >
                                                                    {({ processing }) => (
                                                                        <Button
                                                                            type="submit"
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            disabled={processing}
                                                                        >
                                                                            ✕
                                                                        </Button>
                                                                    )}
                                                                </Form>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Bouton ajouter épisode */}
                                                {showAddEpisode !== season.id && (
                                                    <Button
                                                        onClick={() => setShowAddEpisode(season.id)}
                                                        variant="secondary"
                                                    >
                                                        + Ajouter un épisode
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
