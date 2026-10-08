export type AccountType = 'particulier' | 'entreprise';

/** Compte connecté, partagé sur toutes les pages. */
export type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    /** Structure, renseignée pour les comptes entreprise. */
    company: string | null;
    account_type: AccountType;
};

export type Auth = {
    /** null pour un visiteur non connecté. */
    user: User | null;
};
