import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AppLayout from '@/layouts/app-layout';

import { create, show } from '@/routes/media';

type Props = {
    media: any;
    filters: {
        search?: string;
        type?: string;
        year?: string;
        tags?: string;
        status?: string;
        sort?: string;
    };
    tags: Array<{ id: number; name: string }>;
    years: Array<number>;
};

export default function MediaIndex({ media, filters, tags, years }: Props) {
    // Normaliser les filtres pour éviter les problèmes de types (tout doit être string)
    const normalizedFilters = {
        search: filters.search || '',
        type: String(filters.type || ''),
        year: String(filters.year || ''),
        tags: filters.tags || '',
        status: String(filters.status || ''),
        sort: String(filters.sort || ''),
    };

    const updateFilter = (key: string, value: string | null) => {
        router.get('/media', { ...normalizedFilters, [key]: value }, { preserveState: true });
    };

    const toggleTag = (tagId: number) => {
        const current = normalizedFilters.tags ? normalizedFilters.tags.split(',').map(Number) : [];
        const exists = current.includes(tagId);

        const updated = exists
            ? current.filter((id) => id !== tagId)
            : [...current, tagId];

        updateFilter('tags', updated.length ? updated.join(',') : null);
    };

    return (
        <AppLayout>
            <Head title="Catalogue des médias" />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Catalogue des médias</h1>

                <Link href={create().url}>
                    <Button>Ajouter un média</Button>
                </Link>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-4 mb-6">
                {/* Recherche */}
                <Input
                    placeholder="Rechercher..."
                    defaultValue={normalizedFilters.search}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            updateFilter('search', (e.target as HTMLInputElement).value);
                        }
                    }}
                />

                {/* Type */}
                <Select
                    value={normalizedFilters.type || 'all'}
                    onValueChange={(val) => updateFilter('type', val === 'all' ? null : val)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="movie">Film</SelectItem>
                        <SelectItem value="series">Série</SelectItem>
                    </SelectContent>
                </Select>

                {/* Année */}
                <Select
                    value={normalizedFilters.year || 'all'}
                    onValueChange={(val) => updateFilter('year', val === 'all' ? null : val)}
                >
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Année" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Statut */}
                <Select
                    value={normalizedFilters.status || 'all'}
                    onValueChange={(val) => updateFilter('status', val === 'all' ? null : val)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="not_started">Non commencé</SelectItem>
                    </SelectContent>
                </Select>

                {/* Tri */}
                <Select
                    value={normalizedFilters.sort || 'default'}
                    onValueChange={(val) => updateFilter('sort', val === 'default' ? null : val)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Tri" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="default">Par défaut</SelectItem>
                        <SelectItem value="rating">Note</SelectItem>
                        <SelectItem value="newest">Plus récent</SelectItem>
                        <SelectItem value="oldest">Plus ancien</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Multi-tags */}
            <div className="flex flex-wrap gap-3 mb-6">
                {tags.map((tag) => {
                    const selected = normalizedFilters.tags?.split(',').includes(String(tag.id));

                    return (
                        <div
                            key={tag.id}
                            className={`px-3 py-1 rounded-full border cursor-pointer ${
                                selected ? 'bg-primary text-white' : 'bg-muted'
                            }`}
                            onClick={() => toggleTag(tag.id)}
                        >
                            {tag.name}
                        </div>
                    );
                })}
            </div>

            {/* Grille */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {media.data.map((item: any) => (
                    <Link key={item.id} href={show(item.id).url}>
                        <div className="border rounded-lg overflow-hidden hover:shadow transition">
                            {item.cover && (
                                <img
                                    src={item.cover.startsWith('http') ? item.cover : `/storage/${item.cover}`}
                                    alt={item.title}
                                    className="h-48 w-full object-cover"
                                />
                            )}

                            <div className="p-3">
                                <div className="text-sm uppercase text-muted-foreground">
                                    {item.type}
                                </div>

                                <div className="font-semibold">{item.title}</div>

                                {item.year && (
                                    <div className="text-xs text-muted-foreground">
                                        {item.year}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                {media.links.map((link: any, i: number) => (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        className={`px-3 py-1 border rounded mx-1 ${
                            link.active ? 'bg-primary text-white' : ''
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </AppLayout>
    );
}
