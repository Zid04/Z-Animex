import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen flex flex-col bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">

                {/* HEADER — logo uniquement */}
                <header className="w-full flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <img
                        src="/logo.png"
                        alt="Animex"
                        className="h-16 w-auto"
                    />

                    {/* On supprime les boutons ici */}
                    <div></div>
                </header>

                {/* HERO */}
                <main className="flex flex-col items-center text-center px-6 py-20 flex-1">
                    <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">
                        Votre univers média, organisé.
                    </h2>

                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mb-8">
                        Gérez vos animes, films et séries. Suivez votre progression, ajoutez des favoris,
                        laissez des notes et explorez votre collection comme jamais.
                    </p>

                    {/* BOUTONS CENTRÉS */}
                    <div className="flex gap-4">
                        {!auth.user && (
                            <>
                                <Link
                                    href={login()}
                                    className="px-6 py-3 rounded-md bg-[#f53003] text-white font-medium hover:bg-[#d62802] transition"
                                >
                                    Se connecter
                                </Link>

                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="px-6 py-3 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                                    >
                                        Créer un compte
                                    </Link>
                                )}
                            </>
                        )}

                        {auth.user && (
                            <Link
                                href={dashboard()}
                                className="px-6 py-3 rounded-md bg-[#f53003] text-white font-medium hover:bg-[#d62802] transition"
                            >
                                Accéder au Dashboard
                            </Link>
                        )}
                    </div>
                </main>

                {/* FEATURES */}
                <section className="px-6 py-16 bg-neutral-100 dark:bg-neutral-900">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

                        <FeatureCard
                            title="📚 Catalogue intelligent"
                            desc="Explorez, filtrez et organisez vos médias facilement."
                        />

                        <FeatureCard
                            title="⭐ Notes & favoris"
                            desc="Gardez vos coups de cœur à portée de main."
                        />

                        <FeatureCard
                            title="🎬 Progression épisodes"
                            desc="Suivez votre avancée saison par saison."
                        />

                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-600">
                    © {new Date().getFullYear()} Animex — Tous droits réservés.
                </footer>
            </div>
        </>
    );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="p-6 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{desc}</p>
        </div>
    );
}
