import type { Option } from '@/types';

/** Statuts « en cours » (jaune) ; les autres sont soit validés, soit clos. */
const pending = ['pending', 'new', 'contacted', 'quoted'];
const closed = ['cancelled', 'refunded', 'lost', 'closed'];

export default function StatusPill({ status }: { status: Option }) {
    const tone = pending.includes(status.value)
        ? 'attente'
        : closed.includes(status.value)
          ? 'clos'
          : 'ok';

    return (
        <span className={`status-pill status-pill--${tone}`}>
            {status.label}
        </span>
    );
}
