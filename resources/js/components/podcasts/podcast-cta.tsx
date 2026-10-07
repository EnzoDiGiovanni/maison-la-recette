/** Encart « compte chou » de la maquette : la fonctionnalité reste à créer. */
export default function PodcastCta() {
    return (
        <aside className="podcast-cta">
            <h2>Crée ta salade de podcast&nbsp;!</h2>
            <p>programme tes prochaines écoutes avec ton compte chou</p>
            {/* Le compte auditeur n'existe pas encore : bouton en attente. */}
            <button type="button" disabled>
                Voir mon profil
            </button>
        </aside>
    );
}
