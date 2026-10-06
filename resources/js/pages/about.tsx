import { Head, usePage } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';

export default function About() {
    const { settings } = usePage().props;

    return (
        <SiteLayout>
            <Head title="À propos" />

            <h1>À propos</h1>

            {settings.about_photo_url && (
                <img src={settings.about_photo_url} alt="" />
            )}

            {(settings.about_text ?? '')
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}

            <section>
                <h2>Notre mission : accélérer la transition alimentaire</h2>
                <ul>
                    <li>
                        Inspirer en créant des rencontres avec des acteur·ices
                        du changement qui cultivent, fabriquent, cuisinent de
                        façon durable.
                    </li>
                    <li>
                        Sensibiliser en racontant leurs histoires et en mettant
                        en lumière leurs initiatives et leurs pratiques.
                    </li>
                    <li>
                        Donner le pouvoir d'agir en concevant des expériences
                        concrètes pour explorer les coulisses et solutions de
                        notre alimentation.
                    </li>
                </ul>
            </section>
        </SiteLayout>
    );
}
