import { usePage } from '@inertiajs/react';

export default function SiteFooter() {
    const { settings } = usePage().props;

    const socialLinks = [
        { label: 'Instagram', url: settings.link_instagram },
        { label: 'LinkedIn', url: settings.link_linkedin },
    ].filter((link) => link.url);

    return (
        <footer>
            {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`}>
                    {settings.contact_email}
                </a>
            )}
            <ul>
                {socialLinks.map((link) => (
                    <li key={link.label}>
                        <a href={link.url ?? undefined}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </footer>
    );
}
