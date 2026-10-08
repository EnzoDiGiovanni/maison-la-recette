import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function SpotifyIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.85-1.74-6.43-2.13-10.66-1.17a.75.75 0 1 1-.33-1.46c4.62-1.05 8.6-.6 11.74 1.33.36.22.47.69.25 1.05Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.26-2-8.23-2.59-12.09-1.42a.94.94 0 1 1-.54-1.8c4.4-1.33 9.88-.68 13.6 1.62.44.27.58.85.32 1.29Zm.13-3.4C15.2 8.3 8.77 8.08 5.05 9.21a1.13 1.13 0 1 1-.65-2.16c4.27-1.3 11.37-1.05 15.85 1.6a1.13 1.13 0 0 1-1.15 1.95Z" />
        </svg>
    );
}

export function MusicIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm11 4-6 1.3v7.2a2.5 2.5 0 1 0 1.5 2.3V10.2l3-.65v3.95a2.5 2.5 0 1 0 1.5 2.3V6Z" />
        </svg>
    );
}

export function LinkedinIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm2.4 6.6a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8ZM6.2 18h2.4V9.8H6.2V18Zm4.2 0h2.4v-4.3c0-1.2.5-1.9 1.5-1.9s1.4.7 1.4 1.9V18h2.4v-5.1c0-2.2-1.2-3.3-2.9-3.3-1.3 0-2 .7-2.4 1.3V9.8h-2.4V18Z" />
        </svg>
    );
}

export function InstagramIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
    );
}

export function MicIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
        </svg>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden
            {...props}
        >
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );
}

export function ArrowDownRightIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="M7 7l10 10M17 8v9H8" />
        </svg>
    );
}

export function ChevronRightIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="M10 7l5 5-5 5" />
        </svg>
    );
}

/** Cœur : plein quand l'épisode est dans la liste d'écoute. */
export function HeartIcon({
    filled = false,
    ...props
}: IconProps & { filled?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="M12 20.5C5.5 15.6 3 12.4 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3.4-2.5 6.6-9 11.5Z" />
        </svg>
    );
}

export function PaperPlaneIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />
        </svg>
    );
}

/** Marque-page : plein quand l'épisode est dans la liste d'écoute. */
export function BookmarkIcon({
    filled = false,
    ...props
}: IconProps & { filled?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="M6 4h12v16l-6-4.5L6 20V4Z" />
        </svg>
    );
}
