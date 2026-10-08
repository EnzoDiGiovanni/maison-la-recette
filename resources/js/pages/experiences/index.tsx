import { Head, Link } from '@inertiajs/react';
import BusinessCard from '@/components/experiences/business-card';
import PhotoDialog from '@/components/experiences/photo-dialog';
import { ArrowDownRightIcon } from '@/components/icons';
import Cover from '@/components/podcasts/cover';
import SiteLayout from '@/layouts/site-layout';
import { agenda, listing } from '@/routes/experiences';
import type { Experience, ExperienceTypeLink } from '@/types';

type Props = {
    /** Formats qui ont au moins une expérience publiée. */
    types: ExperienceTypeLink[];
    /** Expérience dont la photo illustre le menu, null si rien n'est publié. */
    spotlight: Experience | null;
};

export default function ExperiencesIndex({ types, spotlight }: Props) {
    return (
        <SiteLayout title="Expériences">
            <Head title="Expériences" />

            <div className="experiences-menu">
                <h1 className="sr-only">Les expériences Maison La recette</h1>

                <BusinessCard />

                <section className="experiences-menu__public">
                    <h2 className="experiences-menu__heading">
                        Expériences ouvertes à tous·tes
                    </h2>

                    <div className="experiences-menu__visual">
                        <Cover
                            src={spotlight?.cover_image_url}
                            className="experiences-menu__photo"
                        />
                        {spotlight && (
                            <PhotoDialog
                                experience={spotlight}
                                className="btn btn--ghost"
                            >
                                Voir les photos
                            </PhotoDialog>
                        )}
                    </div>

                    <nav aria-label="Formats d'expériences">
                        <ul className="experiences-menu__links">
                            {types.map((type) => (
                                <li key={type.slug}>
                                    <Link href={listing.url(type.slug)}>
                                        {type.label}
                                        <ArrowDownRightIcon />
                                    </Link>
                                </li>
                            ))}
                            <li className="experiences-menu__agenda">
                                <Link href={agenda.url()}>
                                    Agenda
                                    <ArrowDownRightIcon />
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </section>
            </div>
        </SiteLayout>
    );
}
