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
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedWatchlistId, setSelectedWatchlistId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Trouver la watchlist sélectionnée
    const selectedWatchlist = selectedWatchlistId 
        ? collections.find(c => c.id === selectedWatchlistId)
        : null;

    return (
        <AppLayout>
            <Head title="Ma Watchlist" />

            <div className="max-w-7xl mx-auto py-10 space-y-10">
                {/* TITRE ET BOUTON CRÉER */}
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

                {/* CONTENTEUR PRINCIPAL - 2 COLONNES */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* COLONNE GAUCHE - LISTE DES WATCHLISTS */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-3">
                            <h3 className="text-lg font-semibold">Mes watchlists</h3>

                            {/* Watchlist par défaut */}
                            {items.length > 0 && (
                                <button
                                    onClick={() => setSelectedWatchlistId(null)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition font-medium ${
                                        selectedWatchlistId === null
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background border-input text-foreground hover:bg-muted hover:border-primary'
                                    }`}
                                >
                                    <div className="text-sm">Sans catégorie</div>
                                    <div className={`text-xs mt-1 ${selectedWatchlistId === null ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                        {items.length} média{items.length > 1 ? 's' : ''}
                                    </div>
                                </button>
                            )}

                            {/* Collections */}
                            {collections.map((collection) => (
                                <button
                                    key={collection.id}
                                    onClick={() => setSelectedWatchlistId(collection.id)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition font-medium ${
                                        selectedWatchlistId === collection.id
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background border-input text-foreground hover:bg-muted hover:border-primary'
                                    }`}
                                >
                                    <div className="text-sm truncate">{collection.title}</div>
                                    <div className={`text-xs mt-1 ${selectedWatchlistId === collection.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                        {collection.watchlists.length} média{collection.watchlists.length > 1 ? 's' : ''}
                                    </div>
                                </button>
                            ))}

                            {items.length === 0 && collections.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Aucune watchlist
                                </p>
                            )}
                        </div>
                    </div>

                    {/* COLONNE DROITE - CONTENU */}
                    <div className="lg:col-span-3">
                        {selectedWatchlistId === null && items.length > 0 ? (
                            // Afficher watchlist par défaut
                            <WatchlistContent
                                title="Sans catégorie"
                                media={items}
                                editingId={editingId}
                                setEditingId={setEditingId}
                                collections={collections}
                            />
                        ) : selectedWatchlist ? (
                            // Afficher collection sélectionnée
                            <CollectionContent
                                collection={selectedWatchlist}
                                editingId={editingId}
                                setEditingId={setEditingId}
                                collections={collections}
                            />
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">
                                    Sélectionnez une watchlist pour voir ses médias
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function WatchlistContent({
    title,
    media,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editingId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setEditingId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collections,
}: {
    title: string;
    media: WatchlistItem[];
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    collections: WatchlistCollection[];
}) {
    const [showAddMedia, setShowAddMedia] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="text-muted-foreground text-sm">
                        {media.length} média{media.length > 1 ? 's' : ''} dans cette watchlist
                    </p>
                </div>
                <Button 
                    onClick={() => setShowAddMedia(!showAddMedia)}
                    size="sm"
                >
                    {showAddMedia ? 'Annuler' : '+ Ajouter un média'}
                </Button>
            </div>

            {showAddMedia && (
                <div className="border rounded-lg p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-4">
                        Naviguer vers la page des médias pour en ajouter à cette watchlist.
                    </p>
                    <Link href="/media" className="inline-block">
                        <Button>Voir tous les médias</Button>
                    </Link>
                </div>
            )}

            {media.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {media.map(({ id, media: mediaItem }) => (
                        <MediaCard
                            key={id}
                            id={id}
                            media={mediaItem}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-10">
                    Aucun média dans cette watchlist.
                </p>
            )}
        </div>
    );
}

function CollectionContent({
    collection,
    editingId,
    setEditingId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collections,
}: {
    collection: WatchlistCollection;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    collections: WatchlistCollection[];
}) {
    const isEditing = editingId === collection.id;
    const [showAddMedia, setShowAddMedia] = useState(false);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">{collection.title}</h2>
                        {collection.description && (
                            <p className="text-muted-foreground text-sm mt-1">{collection.description}</p>
                        )}
                        <p className="text-muted-foreground text-sm mt-1">
                            {collection.watchlists.length} média{collection.watchlists.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex gap-2 flex-col">
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
                        <Button 
                            onClick={() => setShowAddMedia(!showAddMedia)}
                            size="sm"
                        >
                            {showAddMedia ? 'Annuler' : '+ Ajouter un média'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* SÉLECTEUR D'AJOUT DE MÉDIA */}
            {showAddMedia && (
                <div className="border rounded-lg p-4 bg-muted/50">
                    <p>Impossible de chercher les médias depuis la watchlist. Veuillez:</p>
                    <Link href="/media" className="inline-block mt-2">
                        <Button size="sm">Voir tous les médias</Button>
                    </Link>
                </div>
            )}

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collection.watchlists.map(({ id, media }) => (
                        <MediaCard
                            key={id}
                            id={id}
                            media={media}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                    Aucun média dans cette watchlist.
                </p>
            )}
        </div>
    );
}

function MediaCard({ 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id, media }: { id: number; media: MediaItem }) {
    const imageSrc = media.cover && media.cover.startsWith('http') 
        ? media.cover 
        : media.cover ? `/storage/${media.cover}` 
        : '/images/placeholder.png';

    return (
        <div className="border-2 border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all bg-background">
            <Link href={mediaShow.url(media.id)}>
                <img
                    src={imageSrc}
                    alt={media.title}
                    className="w-full h-48 object-cover hover:opacity-90 transition"
                />
            </Link>

            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-sm line-clamp-2 text-foreground">{media.title}</h3>
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
                            variant="destructive"
                            size="sm"
                            disabled={processing}
                            className="w-full text-xs"
                        >
                            {processing ? 'Suppression...' : 'Retirer'}
                        </Button>
                    )}
                </Form>
            </div>
        </div>
    );
}
