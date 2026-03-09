import { Form } from '@inertiajs/react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as watchlistStore } from '@/routes/watchlist';

type WatchlistCollection = {
    id: number;
    title: string;
    description?: string | null;
};

type Props = {
    media_id: number;
    is_in_watchlist?: boolean;
    collections: WatchlistCollection[];
};

export function WatchlistSelector({ media_id, collections }: Props) {
    const [showSelector, setShowSelector] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState<number | null | undefined>(undefined);

    if (!showSelector) {
        return (
            <Button
                onClick={() => {
                    setShowSelector(true);
                    setSelectedCollectionId(undefined); // Reset selection
                }}
                variant="secondary"
            >
                Ajouter à la Watchlist
            </Button>
        );
    }

    // Check if selection is made
    const isSelected = selectedCollectionId !== undefined;

    return (
        <div className="space-y-4 border rounded-lg p-4 bg-white shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Sélectionner une watchlist</h3>
                <button 
                    onClick={() => setShowSelector(false)} 
                    className="text-muted-foreground hover:text-foreground"
                >
                    ✕
                </button>
            </div>

            {/* Collections existantes */}
            {collections.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Collections</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {collections.map(collection => (
                            <button
                                key={collection.id}
                                onClick={() => setSelectedCollectionId(collection.id)}
                                className={`w-full p-3 text-left border-2 rounded transition ${
                                    selectedCollectionId === collection.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="font-medium">{collection.title}</div>
                                {collection.description && (
                                    <div className="text-sm text-muted-foreground mt-1">{collection.description}</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Watchlist générale */}
            <button
                onClick={() => setSelectedCollectionId(null)}
                className={`w-full p-3 text-left border-2 rounded transition ${
                    selectedCollectionId === null
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
                <div className="font-medium">Watchlist générale</div>
                <div className="text-sm text-muted-foreground mt-1">Sans catégorie</div>
            </button>

            {/* Info */}
            {collections.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-2">
                    Créez une nouvelle collection dans votre page watchlist
                </div>
            )}

            {/* Bouton ajouter */}
            {isSelected && (
                <Form
                    action={watchlistStore.form(media_id).action}
                    method={watchlistStore.form(media_id).method}
                    className="space-y-2"
                >
                    <Input
                        type="hidden"
                        name="watchlist_collection_id"
                        value={selectedCollectionId || ''}
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                        Ajouter à la watchlist
                    </button>
                </Form>
            )}

            {!isSelected && (
                <button
                    onClick={() => setShowSelector(false)}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                    Annuler
                </button>
            )}
        </div>
    );
}
