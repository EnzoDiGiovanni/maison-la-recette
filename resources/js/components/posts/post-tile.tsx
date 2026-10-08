import { Link } from '@inertiajs/react';
import PostMedia from '@/components/posts/post-media';
import { formatDate } from '@/lib/format';
import type { PostTone } from '@/lib/post';
import { show } from '@/routes/posts';
import type { Post } from '@/types';

type Props = {
    post: Post;
    tone: PostTone;
};

/** Carte d'un article : visuel, date, titre, chapô. Toute la carte est cliquable. */
export default function PostTile({ post, tone }: Props) {
    return (
        <li className="post-tile">
            <PostMedia
                src={post.cover_image_url}
                tone={tone}
                className="post-tile__media"
            />
            <div className="post-tile__body">
                {post.published_at && (
                    <time
                        className="post-tile__date"
                        dateTime={post.published_at}
                    >
                        {formatDate(post.published_at)}
                    </time>
                )}
                <h3 className="post-tile__title">
                    <Link href={show.url(post)}>{post.title}</Link>
                </h3>
                {post.excerpt && (
                    <p className="post-tile__text">{post.excerpt}</p>
                )}
                <span className="post-tile__more" aria-hidden>
                    Lire l'article
                </span>
            </div>
        </li>
    );
}
