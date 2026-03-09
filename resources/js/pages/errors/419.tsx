import { Head, Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    message?: string;
};

export default function SessionExpired({ message = 'Votre session a expiré. Veuillez recharger la page et réessayer.' }: Props) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Session expirée" />

            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="bg-yellow-500/10 p-4 rounded-full">
                        <Clock className="w-12 h-12 text-yellow-600" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-2">419</h1>
                <h2 className="text-2xl font-semibold mb-4">Session expirée</h2>

                <p className="text-muted-foreground mb-6">
                    {message}
                </p>

                <p className="text-sm text-muted-foreground mb-8">
                    Pour votre sécurité, les sessions inactives sont désactivées après un certain temps.
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
                            Recharger la page
                        </Button>
                    </button>
                </div>
            </div>
        </div>
    );
}
