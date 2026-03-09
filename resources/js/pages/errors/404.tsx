import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    message?: string;
};

export default function NotFound({ message = 'La page que vous recherchez n\'existe pas ou a été supprimée.' }: Props) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Page non trouvée" />

            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="bg-muted p-4 rounded-full">
                        <Search className="w-12 h-12 text-muted-foreground" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-2">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>

                <p className="text-muted-foreground mb-6">
                    {message}
                </p>

                <p className="text-sm text-muted-foreground mb-8">
                    Vérifiez l'URL ou parcourez le catalogue pour trouver ce que vous cherchez.
                </p>

                <div className="space-y-3">
                    <Link href="/" className="block">
                        <Button className="w-full">
                            Retour à la page d'accueil
                        </Button>
                    </Link>

                    <Link href="/media" className="block">
                        <Button variant="outline" className="w-full">
                            Consulter le catalogue
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
