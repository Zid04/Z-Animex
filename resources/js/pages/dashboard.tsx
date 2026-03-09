import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type Tag = {
    id: number;
    name: string;
};

type MediaItem = {
    id: number;
    title: string;
    cover?: string;
    tags: Tag[];
};

type Stats = {
    total: number;
    anime: number;
    movies: number;
    series: number;
    completed: number;
    in_progress: number;
    not_started: number;
};

type DashboardProps = {
    stats: Stats;
    latest_media: MediaItem[];
};

/*
|--------------------------------------------------------------------------
| Dashboard Component
|--------------------------------------------------------------------------
*/

export default function Dashboard({ stats, latest_media }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4">

                {/* Statistiques */}
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="Total médias" value={stats.total} />
                    <StatCard title="Animes" value={stats.anime} />
                    <StatCard title="Films" value={stats.movies} />
                    <StatCard title="Séries" value={stats.series} />
                    <StatCard title="Terminés" value={stats.completed} color="text-green-600" />
                    <StatCard title="En cours" value={stats.in_progress} color="text-yellow-600" />
                    <StatCard title="Non commencés" value={stats.not_started} color="text-red-600" />
                </div>

                {/* Derniers médias */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Derniers médias ajoutés</h2>

                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {latest_media.map((media) => (
                            <Link key={media.id} href={`/media/${media.id}`}>
                                <div className="border rounded-lg overflow-hidden hover:shadow transition">
                                    {media.cover && (
                                        <img
                                            src={media.cover.startsWith('http') ? media.cover : `/storage/${media.cover}`}
                                            className="h-40 w-full object-cover"
                                        />
                                    )}

                                    <div className="p-3 space-y-1">
                                        <div className="font-semibold">{media.title}</div>

                                        <div className="flex flex-wrap gap-1">
                                            {media.tags?.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/*
|--------------------------------------------------------------------------
| Stat Card Component
|--------------------------------------------------------------------------
*/

function StatCard({
    title,
    value,
    color = "text-primary",
}: {
    title: string;
    value: number;
    color?: string;
}) {
    return (
        <div className="p-4 border rounded-xl bg-card shadow-sm">
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </div>
    );
}
