import { ArrowDownRightIcon } from '@/components/icons';
import type { PostTone } from '@/lib/post';

type Props = {
    src: string | null;
    /** Couleur du bloc affiché quand l'article n'a pas de photo. */
    tone: PostTone;
    className: string;
};

/** Visuel d'un article : la photo de couverture, sinon un aplat de couleur. */
export default function PostMedia({ src, tone, className }: Props) {
    return src ? (
        <img
            src={src}
            alt=""
            loading="lazy"
            className={`post-media ${className}`}
        />
    ) : (
        <span
            className={`post-media post-media--${tone} ${className}`}
            aria-hidden
        >
            <ArrowDownRightIcon className="post-media__arrow" />
        </span>
    );
}
