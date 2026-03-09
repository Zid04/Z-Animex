import { Form } from '@inertiajs/react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        <div className="space-y-4 border rounded-lg p-6 bg-background shadow-lg border-border">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Sélectionner une watchlist</h3>
                <button 
                    onClick={() => setShowSelector(false)} 
                    className="text-muted-foreground hover:text-foreground transition"
                >
                    ✕
                </button>
            </div>

            {/* Collections existantes */}
            {collections.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Collections</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {collections.map(collection => (
                            <button
                                key={collection.id}
                                onClick={() => setSelectedCollectionId(collection.id)}
                                className={`w-full p-3 text-left border-2 rounded transition ${
                                    selectedCollectionId === collection.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                        : 'border-input bg-background hover:border-blue-300 hover:bg-muted'
                                }`}
                            >
                                <div className="font-medium text-foreground">{collection.title}</div>
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
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-input bg-background hover:border-blue-300 hover:bg-muted'
                }`}
            >
                <div className="font-medium text-foreground">Watchlist générale</div>
                <div className="text-sm text-muted-foreground mt-1">Sans catégorie</div>
            </button>

            {/* Info */}
            {collections.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-3 bg-muted rounded border border-input">
                    Créez une nouvelle collection dans votre page watchlist
                </div>
            )}

            {/* Bouton ajouter */}
            {isSelected && (
                <Form
                    action={`/media/${media_id}/watchlist`}
                    method="post"
                    className="space-y-3 pt-2 border-t border-border"
                >
                    <Input
                        type="hidden"
                        name="watchlist_collection_id"
                        value={selectedCollectionId || ''}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Ajouter à la watchlist
                    </Button>
                </Form>
            )}

            {!isSelected && (
                <Button
                    onClick={() => setShowSelector(false)}
                    variant="outline"
                    className="w-full"
                >
                    Annuler
                </Button>
            )}
        </div>
    );
}
