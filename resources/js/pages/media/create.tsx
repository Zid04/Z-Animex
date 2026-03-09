import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

import { CharacterCounter } from '@/components/character-counter';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import { store } from '@/routes/media';

interface Episode {
    number: number;
    title: string;
}

interface Season {
    number: number;
    episodes: Episode[];
}

type Props = {
    all_tags: Array<{ id: number; name: string }>;
};

export default function MediaCreate({ all_tags }: Props) {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [currentSeason, setCurrentSeason] = useState(1);
    const [coverType, setCoverType] = useState<'file' | 'url'>('file');
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [titleLength, setTitleLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);

    const MAX_TITLE_LENGTH = 255;
    const MAX_DESCRIPTION_LENGTH = 5000;

    const addSeason = () => {
        if (!seasons.find(s => s.number === currentSeason)) {
            setSeasons([...seasons, { number: currentSeason, episodes: [] }]);
            setCurrentSeason(currentSeason + 1);
        }
    };

    const removeSeason = (seasonNumber: number) => {
        setSeasons(seasons.filter(s => s.number !== seasonNumber));
    };

    const addEpisode = (seasonNumber: number) => {
        setSeasons(seasons.map(season =>
            season.number === seasonNumber
                ? { ...season, episodes: [...season.episodes, { number: season.episodes.length + 1, title: '' }] }
                : season
        ));
    };

    const removeEpisode = (seasonNumber: number, episodeNumber: number) => {
        setSeasons(seasons.map(season =>
            season.number === seasonNumber
                ? { ...season, episodes: season.episodes.filter(e => e.number !== episodeNumber) }
                : season
        ));
    };

    const updateEpisodeTitle = (seasonNumber: number, episodeNumber: number, title: string) => {
        setSeasons(seasons.map(season =>
            season.number === seasonNumber
                ? {
                    ...season,
                    episodes: season.episodes.map(e =>
                        e.number === episodeNumber ? { ...e, title } : e
                    )
                }
                : season
        ));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCoverPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCoverPreview(e.target.value || null);
    };

    return (
        <AppLayout>
            <Head title="Ajouter un média" />

            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">Ajouter un média</h1>

                <Form
                    {...store.form()}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            {/* INFOS MÉDIA */}
                            <div className="border-b pb-6 space-y-4">
                                <h2 className="text-lg font-semibold">Informations du média</h2>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre *</Label>
                                    <Input 
                                        id="title" 
                                        name="title" 
                                        required 
                                        maxLength={MAX_TITLE_LENGTH}
                                        onChange={(e) => setTitleLength(e.target.value.length)}
                                    />
                                    <CharacterCounter 
                                        currentLength={titleLength} 
                                        maxLength={MAX_TITLE_LENGTH}
                                        label="caractères"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        maxLength={MAX_DESCRIPTION_LENGTH}
                                        onChange={(e) => setDescriptionLength(e.target.value.length)}
                                        className="border rounded p-2 w-full min-h-[120px] bg-background text-foreground"
                                    />
                                    <CharacterCounter 
                                        currentLength={descriptionLength} 
                                        maxLength={MAX_DESCRIPTION_LENGTH}
                                        label="caractères"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Année</Label>
                                        <Input id="year" name="year" type="number" />
                                        <InputError message={errors.year} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <select
                                            id="type"
                                            name="type"
                                            className="border rounded p-2 w-full bg-background text-foreground"
                                        >
                                            <option value="anime">Anime</option>
                                            <option value="movie">Film</option>
                                            <option value="series">Série</option>
                                        </select>
                                        <InputError message={errors.type} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="visibility">Visibilité</Label>
                                        <select
                                            id="visibility"
                                            name="visibility"
                                            className="border rounded p-2 w-full bg-background text-foreground"
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Privé</option>
                                        </select>
                                        <InputError message={errors.visibility} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Image de couverture</Label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setCoverType('file')}
                                                className={`flex-1 px-3 py-2 rounded text-sm ${
                                                    coverType === 'file'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted hover:bg-secondary'
                                                }`}
                                            >
                                                Fichier
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCoverType('url')}
                                                className={`flex-1 px-3 py-2 rounded text-sm ${
                                                    coverType === 'url'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted hover:bg-secondary'
                                                }`}
                                            >
                                                URL
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {coverType === 'file' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="cover">Télécharger une image</Label>
                                        <Input
                                            id="cover"
                                            name="cover"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <InputError message={errors.cover} />
                                        {coverPreview && (
                                            <div className="mt-3 border rounded-lg overflow-hidden bg-muted p-2">
                                                <img
                                                    src={coverPreview}
                                                    alt="Aperçu"
                                                    className="max-h-48 w-full object-cover rounded"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="cover_url">URL de l'image</Label>
                                        <Input
                                            id="cover_url"
                                            name="cover_url"
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            onChange={handleUrlChange}
                                        />
                                        <InputError message={errors.cover_url} />
                                        {coverPreview && (
                                            <div className="mt-4 space-y-2">
                                                <div className="border rounded-lg overflow-hidden bg-muted p-3">
                                                    <img
                                                        src={coverPreview}
                                                        alt="Aperçu de couverture"
                                                        className="max-h-64 w-full object-cover rounded"
                                                        onError={() => setCoverPreview(null)}
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground break-all">
                                                    <strong>URL:</strong> {coverPreview}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* SAISONS ET ÉPISODES */}
                            <div className="border-b pb-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Saisons et Épisodes</h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSeason}
                                    >
                                        + Ajouter une saison
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {seasons.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            Pas encore de saisons. Cliquez sur "Ajouter une saison" pour commencer.
                                        </p>
                                    ) : (
                                        seasons.map((season) => (
                                            <div key={season.number} className="border rounded-lg p-4 bg-muted/50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-semibold">Saison {season.number}</h3>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeSeason(season.number)}
                                                    >
                                                        Supprimer
                                                    </Button>
                                                </div>

                                                <div className="space-y-3 ml-4">
                                                    {season.episodes.length === 0 ? (
                                                        <p className="text-sm text-muted-foreground">Aucun épisode</p>
                                                    ) : (
                                                        season.episodes.map((episode) => (
                                                            <div key={episode.number} className="flex gap-2 items-end">
                                                                <div className="flex-shrink-0 w-20">
                                                                    <Label className="text-xs">Épisode {episode.number}</Label>
                                                                </div>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Titre de l'épisode"
                                                                    value={episode.title}
                                                                    onChange={(e) =>
                                                                        updateEpisodeTitle(season.number, episode.number, e.target.value)
                                                                    }
                                                                    className="flex-1"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeEpisode(season.number, episode.number)}
                                                                >
                                                                    ✕
                                                                </Button>
                                                            </div>
                                                        ))
                                                    )}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addEpisode(season.number)}
                                                        className="mt-2"
                                                    >
                                                        + Ajouter un épisode
                                                    </Button>
                                                </div>

                                                <input type="hidden" name={`seasons[${season.number}]`} value={JSON.stringify(season)} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* TAGS */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Genre/Tags</h2>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Sélectionner des genres</Label>
                                    <select
                                        id="tags"
                                        name="tags[]"
                                        multiple
                                        className="border rounded p-2 w-full min-h-[120px] bg-background text-foreground"
                                    >
                                        {all_tags.map(tag => (
                                            <option key={tag.id} value={tag.id}>
                                                {tag.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-muted-foreground">
                                        Tenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs genres
                                    </p>
                                </div>
                            </div>

                            {/* HIDDEN FIELDS FOR SEASONS AND EPISODES */}
                            {seasons.map((season) => (
                                <input
                                    key={`season-${season.number}`}
                                    type="hidden"
                                    name={`seasons[${season.number}]`}
                                    value={JSON.stringify(season)}
                                />
                            ))}

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Envoi…' : 'Créer'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
