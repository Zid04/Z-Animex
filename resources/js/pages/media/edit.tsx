import { Head, Form } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CharacterCounter } from '@/components/character-counter';

import AppLayout from '@/layouts/app-layout';

import { update } from '@/routes/media';

type Props = {
    media: {
        id: number;
        title: string;
        description?: string;
        type: string;
        year?: number;
        visibility: string;
        cover?: string;
    };
};

export default function MediaEdit({ media }: Props) {
    const [coverType, setCoverType] = useState<'file' | 'url'>('file');
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [titleLength, setTitleLength] = useState(media.title.length);
    const [descriptionLength, setDescriptionLength] = useState(media.description?.length || 0);

    const MAX_TITLE_LENGTH = 255;
    const MAX_DESCRIPTION_LENGTH = 5000;

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
            <Head title={`Modifier : ${media.title}`} />

            <div className="max-w-xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">Modifier le média</h1>

                <Form
                    {...update.form(media.id)}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={media.title}
                                    maxLength={MAX_TITLE_LENGTH}
                                    onChange={(e) => setTitleLength(e.target.value.length)}
                                    required
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
                                    defaultValue={media.description}
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

                            <div className="space-y-2">
                                <Label htmlFor="year">Année</Label>
                                <Input
                                    id="year"
                                    name="year"
                                    type="number"
                                    defaultValue={media.year ?? ''}
                                />
                                <InputError message={errors.year} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue={media.type}
                                    className="border rounded p-2 w-full bg-background text-foreground"
                                >
                                    <option value="anime">Anime</option>
                                    <option value="movie">Film</option>
                                    <option value="series">Série</option>
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visibility">Visibilité</Label>
                                <select
                                    id="visibility"
                                    name="visibility"
                                    defaultValue={media.visibility}
                                    className="border rounded p-2 w-full bg-background text-foreground"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Privé</option>
                                </select>
                                <InputError message={errors.visibility} />
                            </div>

                            <div className="space-y-2">
                                <Label>Changer l'image (optionnel)</Label>
                                <div className="flex gap-2 mb-3">
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

                                {coverType === 'file' ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Mise à jour…' : 'Mettre à jour'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
