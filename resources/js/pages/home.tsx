import { Head, Link } from '@inertiajs/react';
import ExperienceCard from '@/components/experience-card';
import PodcastCard from '@/components/podcast-card';
import PostCard from '@/components/post-card';
import QuoteLink from '@/components/quote-link';
import TestimonialsSection from '@/components/testimonials-section';
import SiteLayout from '@/layouts/site-layout';
import { index as experiencesIndex } from '@/routes/experiences';
import { index as podcastsIndex } from '@/routes/podcasts';
import { index as postsIndex } from '@/routes/posts';
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
                        <PodcastCard
                            key={podcast.id}
                            podcast={podcast}
                            compact
                        />
                    ))}
                </ul>
                <Link href={podcastsIndex.url()}>Tous les épisodes</Link>
            </section>

            <section>
                <h2>Les expériences</h2>
                <ul>
                    {experiences.map((experience) => (
                        <ExperienceCard
                            key={experience.id}
                            experience={experience}
                            compact
                        />
                    ))}
                </ul>
                <QuoteLink query={{ type: 'devis_experience' }} />
            </section>

            <TestimonialsSection testimonials={testimonials} />

            <section>
                <h2>Le blog</h2>
                <ul>
                    {latestPosts.map((post) => (
                        <PostCard key={post.id} post={post} compact />
                    ))}
                </ul>
                <Link href={postsIndex.url()}>Tous les articles</Link>
            </section>
        </SiteLayout>
    );
}
