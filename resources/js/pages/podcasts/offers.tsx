import { Head } from '@inertiajs/react';
import QuoteLink from '@/components/quote-link';
import SiteLayout from '@/layouts/site-layout';

const offers = [
    {
        title: 'Sponsoring',
        items: [
            'Message personnalisé en pré-roll',
            'Épisode partenaire en lien avec la ligne éditoriale',
        ],
    },
    {
        title: 'Studio de production',
        items: [
            "Production de podcasts audio et vidéo, de l'idée à la diffusion : conception éditoriale, enregistrement, montage, diffusion et communication.",
        ],
    },
    {
        title: 'Événement',
        items: [
            "Création, animation et enregistrement d'une conférence ou table ronde lors d'un de vos événements autour de l'alimentation et de la gastronomie.",
        ],
    },
];

export default function PodcastsOffers() {
    return (
        <SiteLayout>
            <Head title="Offres podcast" />

            <h1>Amplifiez votre impact grâce au podcast</h1>
            <p>
                La recette met son expertise autour de la création éditoriale,
                de la réalisation audio et vidéo au service des acteur·ices de
                l'alimentation durable : entreprises et organisations.
            </p>

            <ol>
                {offers.map((offer) => (
                    <li key={offer.title}>
                        <h2>{offer.title}</h2>
                        <ul>
                            {offer.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>

            <QuoteLink type="devis_podcast" />
        </SiteLayout>
    );
}
