import { usePage } from '@inertiajs/react';

export default function PlatformLinks() {
    const { settings } = usePage().props;

    const platforms = [
        { label: 'Ausha', url: settings.link_ausha },
        { label: 'Spotify', url: settings.link_spotify },
        { label: 'Apple Podcasts', url: settings.link_apple_podcasts },
        { label: 'Deezer', url: settings.link_deezer },
        { label: 'YouTube', url: settings.link_youtube },
    ].filter((platform) => platform.url);

    if (platforms.length === 0) {
        return null;
    }

    return (
        <ul>
            {platforms.map((platform) => (
                <li key={platform.label}>
                    <a href={platform.url ?? undefined}>{platform.label}</a>
                </li>
            ))}
        </ul>
    );
}
