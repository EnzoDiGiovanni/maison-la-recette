type Props = {
    src: string | null | undefined;
    className: string;
};

/** Visuel carré : l'image si elle existe, sinon le bloc gris de la maquette. */
export default function Cover({ src, className }: Props) {
    return src ? (
        <img src={src} alt="" loading="lazy" className={className} />
    ) : (
        <span className={className} aria-hidden />
    );
}
