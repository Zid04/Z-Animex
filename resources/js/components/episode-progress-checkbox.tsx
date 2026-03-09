import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface EpisodeProgressCheckboxProps {
    mediaId: number;
    seasonId: number;
    episodeId: number;
    watched: boolean;
    storeRoute: any;
    destroyRoute: any;
}

export function EpisodeProgressCheckbox({
    mediaId,
    seasonId,
    episodeId,
    watched,
    storeRoute,
    destroyRoute,
}: EpisodeProgressCheckboxProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleCheckedChange = () => {
        // Soumettre le formulaire via la ref
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    return (
        <Form
            ref={formRef}
            {...(watched ? destroyRoute.form([mediaId, seasonId, episodeId]) : storeRoute.form([mediaId, seasonId, episodeId]))}
            className="inline-block"
        >
            {() => (
                <Checkbox
                    checked={watched}
                    onCheckedChange={handleCheckedChange}
                    className="cursor-pointer"
                />
            )}
        </Form>
    );
}
