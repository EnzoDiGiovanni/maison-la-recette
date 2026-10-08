import { Link } from '@inertiajs/react';
import PostMedia from '@/components/posts/post-media';
import { formatDate } from '@/lib/format';
import { readingTime } from '@/lib/post';
import { show } from '@/routes/posts';
import type { Post } from '@/types';

/** Dernier article publié, mis à la une sur un grand encart jaune. */
export default function PostFeature({ post }: { post: Post }) {
    return (
        <article className="post-feature">
            <PostMedia
                src={post.cover_image_url}
                tone="vert"
                className="post-feature__media"
            />
            <div className="post-feature__body">
                <p className="post-feature__meta">
                    {post.published_at && (
                        <time dateTime={post.published_at}>
                            {formatDate(post.published_at)}
                        </time>
                    )}
                    <span>{readingTime(post)}</span>
                </p>
                <h2 className="post-feature__title">{post.title}</h2>
                {post.excerpt && (
                    <p className="post-feature__text">{post.excerpt}</p>
                )}
                <Link href={show.url(post)} className="btn">
                    Lire l'article
                </Link>
            </div>
        </article>
    );
}
