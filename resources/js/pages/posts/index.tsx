import { Head } from '@inertiajs/react';
import PostCard from '@/components/post-card';
import SiteLayout from '@/layouts/site-layout';
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
                    <PostCard key={post.id} post={post} />
                ))}
            </ul>
        </SiteLayout>
    );
}
