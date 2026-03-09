import { Head, Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    message?: string;
};

export default function Forbidden({ message = 'Vous n\'avez pas accès à cette ressource.' }: Props) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Accès refusé" />

            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="bg-destructive/10 p-4 rounded-full">
                        <AlertCircle className="w-12 h-12 text-destructive" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-2">403</h1>
                <h2 className="text-2xl font-semibold mb-4">Accès refusé</h2>

                <p className="text-muted-foreground mb-6">
                    {message}
                </p>

                <p className="text-sm text-muted-foreground mb-8">
                    Vous n'avez pas les droits nécessaires pour accéder à cette fonctionnalité.
                </p>

                <div className="space-y-3">
                    <Link href="/" className="block">
                        <Button className="w-full">
                            Retour à la page d'accueil
                        </Button>
                    </Link>

                    <Link href="/media" className="block">
                        <Button variant="outline" className="w-full">
                            Voir le catalogue
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
