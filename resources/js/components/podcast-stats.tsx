import { usePage } from '@inertiajs/react';

export default function PodcastStats() {
    const { settings } = usePage().props;

    const stats = [
        { label: 'Note moyenne', value: settings.podcast_rating },
        { label: 'Avis', value: settings.podcast_reviews_count },
        { label: "Taux d'écoute moyen", value: settings.podcast_listen_rate },
        { label: 'Écoutes', value: settings.podcast_total_listens },
        { label: 'Épisodes', value: settings.podcast_episodes_count },
    ].filter((stat) => stat.value);

    if (stats.length === 0) {
        return null;
    }

    return (
        <dl>
            {stats.map((stat) => (
                <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                </div>
            ))}
        </dl>
    );
}
