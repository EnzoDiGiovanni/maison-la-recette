import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { formatDate } from '@/lib/format';
import { show } from '@/routes/posts';
import type { Post } from '@/types';

type Props = {
    posts: Post[];
};

export default function PostsIndex({ posts }: Props) {
    return (
        <SiteLayout>
            <Head title="Blog" />

            <h1>Le blog</h1>

            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        {post.cover_image_url && (
                            <img src={post.cover_image_url} alt="" />
                        )}
                        <Link href={show.url(post)}>{post.title}</Link>
                        {post.published_at && (
                            <time dateTime={post.published_at}>
                                {formatDate(post.published_at)}
                            </time>
                        )}
                        {post.excerpt && <p>{post.excerpt}</p>}
                    </li>
                ))}
            </ul>
        </SiteLayout>
    );
}
