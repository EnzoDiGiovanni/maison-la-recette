import { Head, Link } from '@inertiajs/react';
import CtaBlock from '@/components/cta-block';
import { ArrowDownRightIcon } from '@/components/icons';
import PostTile from '@/components/posts/post-tile';
import SectionTitle from '@/components/section-title';
import SiteLayout from '@/layouts/site-layout';
import { formatDate } from '@/lib/format';
import { postTone, readingTime } from '@/lib/post';
import { index as experiencesIndex } from '@/routes/experiences';
import { index } from '@/routes/posts';
import type { Post } from '@/types';

type Props = {
    post: Post;
    /** Autres articles publiés, les plus récents d'abord. */
    otherPosts: Post[];
};

export default function PostsShow({ post, otherPosts }: Props) {
    return (
        <SiteLayout title="Blog">
            <Head title={post.meta_title ?? post.title}>
                {post.meta_description && (
                    <meta name="description" content={post.meta_description} />
                )}
            </Head>

            <div className="post-page">
                <Link href={index.url()} className="post-page__back">
                    <ArrowDownRightIcon />
                    Tous les articles
                </Link>

                <article>
                    <header className="post-page__header">
                        <p className="post-page__meta">
                            {post.published_at && (
                                <time dateTime={post.published_at}>
                                    {formatDate(post.published_at)}
                                </time>
                            )}
                            <span>{readingTime(post)}</span>
                        </p>
                        <h1 className="post-page__title">{post.title}</h1>
                        {post.excerpt && (
                            <p className="post-page__lead">{post.excerpt}</p>
                        )}
                    </header>

                    {post.cover_image_url && (
                        <img
                            src={post.cover_image_url}
                            alt=""
                            className="post-page__cover"
                        />
                    )}

                    {/* Texte mis en forme rédigé dans le back-office. */}
                    <div
                        className="post-body"
                        dangerouslySetInnerHTML={{ __html: post.body }}
                    />
                </article>

                <CtaBlock
                    title={<>Envie de passer à table&nbsp;?</>}
                    href={experiencesIndex.url()}
                    label="Voir les expériences"
                >
                    Ateliers, good tours et immersions à Lyon, aux côtés de
                    chef·fes et d'artisan·es engagé·es.
                </CtaBlock>

                {otherPosts.length > 0 && (
                    <section>
                        <SectionTitle>À lire aussi</SectionTitle>
                        <ul className="post-grid">
                            {otherPosts.map((other, position) => (
                                <PostTile
                                    key={other.id}
                                    post={other}
                                    tone={postTone(position)}
                                />
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </SiteLayout>
    );
}
