import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { formatDate } from '@/lib/format';
import { index } from '@/routes/posts';
import type { Post } from '@/types';

type Props = {
    post: Post;
};

export default function PostsShow({ post }: Props) {
    return (
        <SiteLayout>
            <Head title={post.meta_title ?? post.title}>
                {post.meta_description && (
                    <meta name="description" content={post.meta_description} />
                )}
            </Head>

            <Link href={index.url()}>Tous les articles</Link>

            <article>
                <h1>{post.title}</h1>
                {post.published_at && (
                    <time dateTime={post.published_at}>
                        {formatDate(post.published_at)}
                    </time>
                )}
                {post.cover_image_url && (
                    <img src={post.cover_image_url} alt="" />
                )}
                {post.excerpt && <p>{post.excerpt}</p>}

                {/* Texte mis en forme rédigé dans le back-office. */}
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
            </article>
        </SiteLayout>
    );
}
