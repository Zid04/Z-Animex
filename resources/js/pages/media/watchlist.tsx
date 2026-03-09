import { Head, Link, Form } from '@inertiajs/react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import { show as mediaShow } from '@/routes/media';
import { destroy as watchlistDestroy } from '@/routes/watchlist';
import { store as watchlistCollectionStore, update as watchlistCollectionUpdate, destroy as watchlistCollectionDestroy } from '@/routes/watchlist-collections';

type MediaItem = {
    id: number;
    title: string;
    cover?: string | null;
    year?: number | null;
    type: string;
};

type WatchlistItem = {
    id: number;
    media: MediaItem;
    watchlist_collection_id?: number | null;
};

type WatchlistCollection = {
    id: number;
    title: string;
    description?: string | null;
    watchlists: WatchlistItem[];
};

type Props = {
    items: WatchlistItem[];
    collections: WatchlistCollection[];
};

export default function Watchlist({ items, collections }: Props) {
    // Debug: Log the actual cover URLs received
    if (items.length > 0) {
        console.log('First item cover:', items[0].media.cover);
        console.log('Starts with http:', items[0].media.cover?.startsWith('http'));
    }
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    return (
        <AppLayout>
            <Head title="Ma Watchlist" />

            <div className="max-w-6xl mx-auto py-10 space-y-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">Ma Watchlist</h1>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        variant={showAddForm ? 'secondary' : 'default'}
                    >
                        {showAddForm ? 'Annuler' : '+ Ajouter une watchlist'}
                    </Button>
                </div>

                {/* FORMULAIRE CRÉATION WATCHLIST */}
                {showAddForm && (
                    <div className="border rounded-lg p-6 bg-muted/50">
                        <h2 className="text-lg font-semibold mb-4">Créer une nouvelle watchlist</h2>
                        <Form
                            {...watchlistCollectionStore.form()}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titre</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Ex: À regarder en été"
                                            required
                                        />
                                        {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (optionnel)</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Décrivez cette watchlist..."
                                            className="border rounded p-2 w-full min-h-[100px]"
                                        />
                                        {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Création...' : 'Créer la watchlist'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                )}

                {/* WATCHLIST PAR DÉFAUT */}
                {items.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Sans catégorie</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {items.map(({ id, media }) => (
                                <WatchlistCard
                                    key={id}
                                    id={id}
                                    media={media}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* COLLECTIONS */}
                {collections.length > 0 && (
                    <div className="space-y-6">
                        {collections.map((collection) => (
                            <CollectionSection
                                key={collection.id}
                                collection={collection}
                                editingId={editingId}
                                setEditingId={setEditingId}
                            />
                        ))}
                    </div>
                )}

                {items.length === 0 && collections.length === 0 && (
                    <p className="text-muted-foreground text-center py-10">
                        Votre watchlist est vide. Ajoutez des médias ou créez une nouvelle liste!
                    </p>
                )}
            </div>
        </AppLayout>
    );
}

function WatchlistCard({ id, media }: { id: number; media: MediaItem }) {
    const imageSrc = media.cover && media.cover.startsWith('http') 
        ? media.cover 
        : media.cover ? `/storage/${media.cover}` 
        : '/images/placeholder.png';

    return (
        <div className="border rounded-lg overflow-hidden hover:shadow transition bg-white">
            <Link href={mediaShow.url(media.id)}>
                <img
                    src={imageSrc}
                    alt={media.title}
                    className="w-full h-48 object-cover"
                />
            </Link>

            <div className="p-3 space-y-2">
                <h3 className="font-semibold text-sm">{media.title}</h3>
                <p className="text-xs text-muted-foreground">
                    {media.year ?? '—'} • {media.type}
                </p>

                <Form
                    {...watchlistDestroy.form(media.id)}
                    className="pt-2"
                >
                    {({ processing }) => (
                        <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            disabled={processing}
                            className="w-full text-xs"
                        >
                            Retirer
                        </Button>
                    )}
                </Form>
            </div>
        </div>
    );
}

function CollectionSection({
    collection,
    editingId,
    setEditingId,
}: {
    collection: WatchlistCollection;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
}) {
    const isEditing = editingId === collection.id;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-xl font-semibold">{collection.title}</h2>
                    {collection.description && (
                        <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(isEditing ? null : collection.id)}
                    >
                        {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>

                    <Form
                        {...watchlistCollectionDestroy.form(collection.id)}
                        className="inline"
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                size="sm"
                                disabled={processing}
                                onClick={(e) => {
                                    if (!confirm('Confirmer la suppression de cette watchlist?')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Supprimer
                            </Button>
                        )}
                    </Form>
                </div>
            </div>

            {/* FORMULAIRE ÉDITION */}
            {isEditing && (
                <div className="border rounded-lg p-4 bg-muted/50">
                    <Form
                        {...watchlistCollectionUpdate.form(collection.id)}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${collection.id}`}>Titre</Label>
                                    <Input
                                        id={`title-${collection.id}`}
                                        name="title"
                                        defaultValue={collection.title}
                                        required
                                    />
                                    {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`description-${collection.id}`}>Description</Label>
                                    <textarea
                                        id={`description-${collection.id}`}
                                        name="description"
                                        defaultValue={collection.description || ''}
                                        className="border rounded p-2 w-full min-h-[80px]"
                                    />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mise à jour...' : 'Confirmer'}
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            )}

            {/* GRILLE DES MÉDIAS */}
            {collection.watchlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collection.watchlists.map(({ id, media }) => (
                        <WatchlistCard
                            key={id}
                            id={id}
                            media={media}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground py-4">Aucun média dans cette watchlist.</p>
            )}
        </div>
    );
}
