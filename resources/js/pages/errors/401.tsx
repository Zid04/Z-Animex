import { Head, Link } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    message?: string;
};

export default function Unauthorized({ message = 'Vous devez être connecté pour accéder à cette ressource.' }: Props) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Authentification requise" />

            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="bg-muted p-4 rounded-full">
                        <Lock className="w-12 h-12 text-muted-foreground" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-2">401</h1>
                <h2 className="text-2xl font-semibold mb-4">Authentification requise</h2>

                <p className="text-muted-foreground mb-6">
                    {message}
                </p>

                <p className="text-sm text-muted-foreground mb-8">
                    Veuillez vous connecter à votre compte pour continuer.
                </p>

                <div className="space-y-3">
                    <Link href="/login" className="block">
                        <Button className="w-full">
                            Se connecter
                        </Button>
                    </Link>

                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full">
                            Retour à la page d'accueil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
