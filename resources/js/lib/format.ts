export function formatDate(value: string): string {
    // Les dates seules (AAAA-MM-JJ) sont lues en UTC : on les affiche en UTC
    // pour ne pas reculer d'un jour selon le fuseau du visiteur.
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
        timeZone: 'UTC',
    }).format(new Date(value));
}

export function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
        // Les expériences ont lieu en France : toujours l'heure de Paris.
        timeZone: 'Europe/Paris',
    }).format(new Date(value));
}

export function formatPrice(euros: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: Number.isInteger(euros) ? 0 : 2,
    }).format(euros);
}

/** Durée d'écoute arrondie à la minute : « 53 min », « 1 h 07 ». */
export function formatDuration(seconds: number): string {
    const minutes = Math.max(1, Math.round(seconds / 60));

    return minutes < 60
        ? `${minutes} min`
        : `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`;
}
