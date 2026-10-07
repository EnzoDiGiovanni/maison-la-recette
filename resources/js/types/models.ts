export type Option = {
    value: string;
    label: string;
};

export type Speaker = {
    id: number;
    name: string;
    /** Fonction ou structure, par exemple « Cheffe étoilée ». */
    role: string | null;
    bio: string | null;
    photo_url: string | null;
};

export type Podcast = {
    id: number;
    title: string;
    slug: string;
    season: number | null;
    number: number | null;
    /** Lien vers la page d'écoute. */
    link: string;
    /** Fichier audio de l'épisode, importé depuis Ausha. */
    audio_url: string | null;
    /** Durée en secondes. */
    duration: number | null;
    /** Code HTML du lecteur à intégrer, collé depuis le back-office. */
    iframe: string | null;
    image_url: string | null;
    summary: string | null;
    /** Phrase marquante de l'intervenant, sans guillemets. */
    quote: string | null;
    /** Intervenant de l'épisode, null si non renseigné. */
    speaker: Speaker | null;
    /** Date au format AAAA-MM-JJ. */
    published_at: string | null;
    is_featured: boolean;
    /** Dans la liste « à écouter plus tard » du compte connecté. */
    is_favorite: boolean;
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

/** Expérience mise en avant, avec sa prochaine date ouverte s'il y en a une. */
export type LatestExperience = Experience & {
    /** Date et heure au format ISO 8601, null si rien n'est programmé. */
    next_session_at: string | null;
};

/** Date d'expérience déjà passée. */
export type PastEvent = {
    id: number;
    /** Date et heure au format ISO 8601. */
    starts_at: string;
    experience: Experience;
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

/** Compte client affiché sur /dashboard. */
export type Account = {
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    /** value : particulier | entreprise. */
    type: Option;
    /** Seuls les particuliers réservent en ligne. */
    can_book_online: boolean;
    /** Lien vers le back-office, uniquement pour le rôle admin. */
    admin_url: string | null;
    /** Date au format AAAA-MM-JJ. */
    member_since: string | null;
};

export type Booking = {
    id: number;
    /** value : pending | paid | cancelled | refunded. */
    status: Option;
    seats: number;
    /** Montant total en euros. */
    amount: number;
    /** Date du paiement (de démonstration), null si non payée. */
    paid_at: string | null;
    created_at: string | null;
    is_upcoming: boolean;
    can_cancel: boolean;
    session: {
        /** Date et heure au format ISO 8601. */
        starts_at: string;
        location: string | null;
    };
    experience: {
        title: string;
        slug: string;
        type: string;
        is_published: boolean;
    };
};

/** Demande de contact ou de devis envoyée depuis un compte. */
export type Inquiry = {
    id: number;
    type: Option;
    /** value : new | contacted | quoted | won | lost | closed. */
    status: Option;
    experience_type: string | null;
    participants: number | null;
    /** Date au format AAAA-MM-JJ. */
    desired_date: string | null;
    venue: string | null;
    message: string;
    created_at: string | null;
};
