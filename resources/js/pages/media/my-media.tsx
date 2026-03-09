import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

import AppLayout from '@/layouts/app-layout';

import { edit, mine, show } from '@/routes/media';

type Props = {
    media: {
        data: Array<{
            id: number;
            title: string;
            type: string;
            year?: number;
            cover?: string;
        }>;
    };
};

export default function MyMedia({ media }: Props) {
    return (
        <AppLayout>
            <Head title="Mes médias" />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Mes médias</h1>

                <Link href={mine().url}>
                    <Button variant="outline">Actualiser</Button>
                </Link>
            </div>

            {media.data.length === 0 && (
                <p className="text-muted-foreground">
                    Vous n’avez encore ajouté aucun média.
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {media.data.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden hover:shadow transition bg-background"
                    >
                        <Link href={show(item.id).url} className="group no-underline block">
                            {item.cover && (
                                <img
                                    src={item.cover.startsWith('http') ? item.cover : `/storage/${item.cover}`}
                                    alt={item.title}
                                    className="h-48 w-full object-cover"
                                />
                            )}
                        </Link>

                        <div className="p-3 space-y-2">
                            <div className="text-sm uppercase text-muted-foreground">
                                {item.type}
                            </div>

                            <div className="font-semibold">{item.title}</div>

                            {item.year && (
                                <div className="text-xs text-muted-foreground">
                                    {item.year}
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Link href={show(item.id).url} className="flex-1">
                                    <Button variant="secondary" className="w-full">
                                        Voir
                                    </Button>
                                </Link>

                                <Link href={edit(item.id).url} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        Modifier
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
