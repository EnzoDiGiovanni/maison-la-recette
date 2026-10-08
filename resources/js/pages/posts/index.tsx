import { Head } from '@inertiajs/react';
import CtaBlock from '@/components/cta-block';
import PostFeature from '@/components/posts/post-feature';
import PostTile from '@/components/posts/post-tile';
import SectionTitle from '@/components/section-title';
import useReveal from '@/hooks/use-reveal';
import SiteLayout from '@/layouts/site-layout';
import { postTone } from '@/lib/post';
import quote from '@/routes/contact/quote';
import type { Post } from '@/types';

type Props = {
    /** Articles publiés, du plus récent au plus ancien. */
    posts: Post[];
};

export default function PostsIndex({ posts }: Props) {
    useReveal();

    const [latest, ...others] = posts;

    return (
        <SiteLayout title="Blog">
            <Head title="Blog" />

            <div className="blog-page">
                <h1 className="sr-only">Le blog</h1>

                <p className="blog-page__intro">
                    Des idées à déguster
                    <span>
                        Coulisses, conseils et rencontres pour explorer
                        l'alimentation de demain.
                    </span>
                </p>

                {latest === undefined ? (
                    <p className="account-empty">
                        Les premiers articles mijotent encore. Revenez vite !
                    </p>
                ) : (
                    <section>
                        <SectionTitle>À la une</SectionTitle>
                        <PostFeature post={latest} />
                    </section>
                )}

                {others.length > 0 && (
                    <section className="reveal">
                        <SectionTitle>Tous les articles</SectionTitle>
                        <ul className="post-grid">
                            {others.map((post, position) => (
                                <PostTile
                                    key={post.id}
                                    post={post}
                                    tone={postTone(position + 1)}
                                />
                            ))}
                        </ul>
                    </section>
                )}

                <CtaBlock
                    title={<>Un projet pour votre équipe&nbsp;?</>}
                    href={quote.experience.url()}
                    label="Demander un devis"
                >
                    Atelier, good tour ou immersion : date, lieu et nombre de
                    participant·es s'adaptent à votre événement, sur devis.
                </CtaBlock>
            </div>
        </SiteLayout>
    );
}
