import { Head, Link } from '@inertiajs/react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    message?: string;
};

export default function TooManyRequests({ message = 'Vous avez effectué trop de requêtes. Veuillez réessayer dans quelques instants.' }: Props) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Trop de requêtes" />

            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="bg-yellow-500/10 p-4 rounded-full">
                        <Zap className="w-12 h-12 text-yellow-600" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-2">429</h1>
                <h2 className="text-2xl font-semibold mb-4">Trop de requêtes</h2>

                <p className="text-muted-foreground mb-6">
                    {message}
                </p>

                <p className="text-sm text-muted-foreground mb-8">
                    Vous avez atteint la limite de requêtes. Veuillez attendre un peu avant de réessayer.
                </p>

                <div className="space-y-3">
                    <Link href="/" className="block">
                        <Button className="w-full">
                            Retour à la page d'accueil
                        </Button>
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        <Button variant="outline" className="w-full">
                            Réessayer
                        </Button>
                    </button>
                </div>
            </div>
        </div>
    );
}
