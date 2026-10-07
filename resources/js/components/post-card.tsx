import { Link } from '@inertiajs/react';
import { formatDate } from '@/lib/format';
import { show } from '@/routes/posts';
import type { Post } from '@/types';

type Props = {
    post: Post;
    /** Version raccourcie pour la page d'accueil : titre + extrait. */
    compact?: boolean;
};

export default function PostCard({ post, compact = false }: Props) {
    return (
        <li>
            {!compact && post.cover_image_url && (
                <img src={post.cover_image_url} alt="" />
            )}
            <Link href={show.url(post)}>{post.title}</Link>
            {!compact && post.published_at && (
                <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                </time>
            )}
            {post.excerpt && <p>{post.excerpt}</p>}
        </li>
    );
}
