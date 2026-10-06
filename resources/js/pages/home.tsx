import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { formatPrice } from '@/lib/format';
import { contact } from '@/routes';
import {
    index as experiencesIndex,
    show as showExperience,
} from '@/routes/experiences';
import { index as podcastsIndex, show as showPodcast } from '@/routes/podcasts';
import { index as postsIndex, show as showPost } from '@/routes/posts';
import type { Experience, Podcast, Post, Testimonial } from '@/types';

type Props = {
    featuredPodcasts: Podcast[];
    experiences: Experience[];
    testimonials: Testimonial[];
    latestPosts: Post[];
};

export default function Home({
    featuredPodcasts,
    experiences,
    testimonials,
    latestPosts,
}: Props) {
    return (
        <SiteLayout>
            <Head title="Accueil" />

            <section>
                <h1>Maison La recette</h1>
                <p>Explorer l'alimentation de demain, en podcast et en vrai.</p>
                <Link href={podcastsIndex.url()}>Écouter le podcast</Link>
                <Link href={experiencesIndex.url()}>
                    Découvrir les expériences
                </Link>
            </section>

            <section>
                <h2>Le podcast</h2>
                <ul>
                    {featuredPodcasts.map((podcast) => (
                        <li key={podcast.id}>
                            {podcast.image_url && (
                                <img src={podcast.image_url} alt="" />
                            )}
                            <Link href={showPodcast.url(podcast)}>
                                {podcast.title}
                            </Link>
                            {podcast.quote && (
                                <blockquote>{podcast.quote}</blockquote>
                            )}
                            {podcast.speaker && <p>{podcast.speaker.name}</p>}
                        </li>
                    ))}
                </ul>
                <Link href={podcastsIndex.url()}>Tous les épisodes</Link>
            </section>

            <section>
                <h2>Les expériences</h2>
                <ul>
                    {experiences.map((experience) => (
                        <li key={experience.id}>
                            <p>{experience.type.label}</p>
                            <Link href={showExperience.url(experience)}>
                                {experience.title}
                            </Link>
                            {experience.tagline && <p>{experience.tagline}</p>}
                            <p>
                                {experience.price_from === null
                                    ? 'Sur devis'
                                    : `À partir de ${formatPrice(experience.price_from)} par personne`}
                            </p>
                        </li>
                    ))}
                </ul>
                <Link
                    href={contact.url({ query: { type: 'devis_experience' } })}
                >
                    Demander un devis
                </Link>
            </section>

            <section>
                <h2>Avis de nos client·es</h2>
                <ul>
                    {testimonials.map((testimonial) => (
                        <li key={testimonial.id}>
                            <blockquote>{testimonial.quote}</blockquote>
                            <p>
                                {testimonial.author_name}
                                {testimonial.author_role &&
                                    `, ${testimonial.author_role}`}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Le blog</h2>
                <ul>
                    {latestPosts.map((post) => (
                        <li key={post.id}>
                            <Link href={showPost.url(post)}>{post.title}</Link>
                            {post.excerpt && <p>{post.excerpt}</p>}
                        </li>
                    ))}
                </ul>
                <Link href={postsIndex.url()}>Tous les articles</Link>
            </section>
        </SiteLayout>
    );
}
