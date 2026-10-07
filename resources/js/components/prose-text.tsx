/** Découpe un texte rédigé en paragraphes séparés par des lignes vides. */
export default function ProseText({
    text,
}: {
    text: string | null | undefined;
}) {
    if (!text) {
        return null;
    }

    return text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}
