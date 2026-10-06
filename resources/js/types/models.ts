export type Option = {
    value: string;
    label: string;
};

export type Podcast = {
    id: number;
    title: string;
    slug: string;
    season: number | null;
    number: number | null;
    /** Lien vers la page d'écoute. */
    link: string;
    /** Code HTML du lecteur à intégrer, collé depuis le back-office. */
    iframe: string | null;
    summary: string | null;
    /** Date au format AAAA-MM-JJ. */
    published_at: string | null;
    is_featured: boolean;
};

export type Experience = {
    id: number;
    /** value : atelier | food_tour | immersion. */
    type: Option;
    title: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    highlights: string[];
    duration_label: string | null;
    /** Prix « à partir de » en euros par personne, null si sur devis. */
    price_from: number | null;
    location: string | null;
    cover_image_url: string | null;
    photo_urls: string[];
};

export type ExperienceSession = {
    id: number;
    /** Date et heure au format ISO 8601. */
    starts_at: string;
    location: string | null;
    capacity: number;
    remaining_seats: number;
    /** Prix en euros par personne. */
    price: number;
};

export type Testimonial = {
    id: number;
    author_name: string;
    author_role: string | null;
    quote: string;
    experience_type: string | null;
};

export type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    /** Contenu HTML rédigé dans le back-office. */
    body: string;
    cover_image_url: string | null;
    /** Date au format AAAA-MM-JJ. */
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
};

/** Réglages du site, partagés sur toutes les pages. */
export type Settings = Partial<
    Record<
        | 'podcast_rating'
        | 'podcast_reviews_count'
        | 'podcast_listen_rate'
        | 'podcast_total_listens'
        | 'podcast_episodes_count'
        | 'link_ausha'
        | 'link_spotify'
        | 'link_apple_podcasts'
        | 'link_deezer'
        | 'link_youtube'
        | 'link_instagram'
        | 'link_linkedin'
        | 'contact_email'
        | 'about_text'
        | 'about_photo_url',
        string | null
    >
>;
