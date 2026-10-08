/** Hitos redondos: celebrar cada pocas cotizaciones cansaria a quien cotiza a diario. */
const MILESTONES = [10, 25, 50, 100, 250, 500, 1000] as const

/** Cotizaciones que hace un anonimo antes de que le propongamos una cuenta. */
const SIGNUP_INVITE_AT = 3

/** Mismo enfriamiento que el banner de donacion, para no encadenar avisos. */
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000

const SEEN_KEY = 'fp.celebrated'
const LAST_SHOWN_KEY = 'fp.celebrated_at'

export type Celebration = {
    id: string
    title: string
    body: string
    /** Invitar a registrarse solo tiene sentido para quien no tiene cuenta. */
    cta?: 'signup'
}

/* La voz del panda: entusiasta y juguetona. Los emojis solo aparecen aqui. */
const MILESTONE_COPY: Record<number, { title: string; body: string }> = {
    10: {
        title: '¡Diez cotizaciones!',
        body: 'Ya le cogiste el truco. Este panda te está mirando con orgullo. 🐼',
    },
    25: {
        title: '¡25 cotizaciones!',
        body: 'A este ritmo vas a gastar la impresora. Sigue así.',
    },
    50: {
        title: '¡50 cotizaciones!',
        body: 'Ojalá muchas se hayan convertido en ventas. ¡Vamos por más! 🐼',
    },
    100: {
        title: '¡100 cotizaciones!',
        body: 'Tres cifras. Esto ya es oficialmente mucho trabajo bien hecho.',
    },
    250: {
        title: '¡250 cotizaciones!',
        body: 'Vale, ya eres de la casa. El panda te guarda un bambú. 🐼',
    },
    500: {
        title: '¡500 cotizaciones!',
        body: 'Quinientas. El panda se quita el sombrero que no tiene.',
    },
    1000: {
        title: '¡Mil cotizaciones!',
        body: 'Mil. No sabemos qué decir, así que solo: ¡gracias! 🐼',
    },
}

const readSeen = (): string[] => {
    try {
        const raw = localStorage.getItem(SEEN_KEY)
        return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
        return []
    }
}

const isCoolingDown = (now: number): boolean => {
    const raw = Number(localStorage.getItem(LAST_SHOWN_KEY))

    return Number.isFinite(raw) && raw > 0 && now - raw < COOLDOWN_MS
}

/**
 * Decide si toca celebrar tras generar una cotizacion.
 *
 * `count` viene de la cabecera X-Quotation-Count cuando hay sesion, y del
 * contador local del navegador cuando no la hay.
 */
export function celebrationFor(
    count: number,
    isLoggedIn: boolean,
    now: number = Date.now(),
): Celebration | null {
    if (!Number.isFinite(count) || count <= 0) return null

    const seen = readSeen()

    /* A quien no tiene cuenta se le propone crearla, no se le dan hitos:
       sin sesion no podemos seguir su historial de verdad. */
    if (!isLoggedIn) {
        const id = 'signup-invite'

        if (count < SIGNUP_INVITE_AT || seen.includes(id) || isCoolingDown(now)) return null

        return {
            id,
            title: `¡Ya van ${count} cotizaciones!`,
            body: 'Crea tu cuenta y te las guardo todas, con tus productos listos para reutilizar. 🐼',
            cta: 'signup',
        }
    }

    const reached = MILESTONES.find((milestone) => milestone === count)

    if (reached === undefined) return null

    const id = `milestone-${reached}`

    if (seen.includes(id) || isCoolingDown(now)) return null

    return { id, ...MILESTONE_COPY[reached] }
}

/** Marca la celebracion como vista para que no se repita. */
export function markCelebrationSeen(id: string, now: number = Date.now()): void {
    try {
        const seen = readSeen()

        if (!seen.includes(id)) {
            localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id]))
        }

        localStorage.setItem(LAST_SHOWN_KEY, String(now))
    } catch {
        /* Modo privado o almacenamiento lleno: no celebrar es preferible a fallar. */
    }
}
