import { Head, Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    message?: string;
};

export default function ServerError({ message = 'Une erreur s\'est produite lors du traitement de votre demande.' }: Props) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Erreur serveur" />

            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="bg-destructive/10 p-4 rounded-full">
                        <AlertTriangle className="w-12 h-12 text-destructive" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-2">500</h1>
                <h2 className="text-2xl font-semibold mb-4">Erreur serveur</h2>

                <p className="text-muted-foreground mb-6">
                    {message}
                </p>

                <p className="text-sm text-muted-foreground mb-8">
                    Notre équipe a été notifiée de ce problème. Veuillez réessayer dans quelques instants.
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
