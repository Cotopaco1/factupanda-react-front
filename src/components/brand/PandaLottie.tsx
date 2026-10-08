import { Suspense, lazy, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * El reproductor de dotLottie carga un binario WASM, asi que se importa de
 * forma diferida: quien nunca ve una animacion no lo descarga.
 */
const DotLottieReact = lazy(() =>
    import('@lottiefiles/dotlottie-react').then((m) => ({ default: m.DotLottieReact })),
)

export type PandaAnimation = 'reposo' | 'generando' | 'listo' | 'descargar' | 'vacio' | 'error'

/** "listo" termina en la pose feliz y se queda ahi; el resto son bucles. */
const ONE_SHOT: PandaAnimation[] = ['listo']

const LABELS: Record<PandaAnimation, string> = {
    reposo: 'FactuPanda',
    generando: 'Generando tu PDF',
    listo: 'PDF listo',
    descargar: 'Descargando',
    vacio: 'Aún no tienes cotizaciones',
    error: 'Algo salió mal',
}

/**
 * Se relee en vivo: alguien puede cambiar la preferencia con la pagina abierta.
 */
function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(
        () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    )

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)')
        const onChange = () => setReduced(query.matches)

        query.addEventListener('change', onChange)

        return () => query.removeEventListener('change', onChange)
    }, [])

    return reduced
}

type Props = {
    name: PandaAnimation
    size?: number | string
    className?: string
    /** Pasa "" cuando la animacion es puramente decorativa. */
    label?: string
}

export function PandaLottie({ name, size = 160, className, label }: Props) {
    const reduced = usePrefersReducedMotion()
    const accessibleLabel = label ?? LABELS[name]
    const dimension = typeof size === 'number' ? `${size}px` : size

    return (
        <div
            className={cn('shrink-0', className)}
            style={{ width: dimension, height: dimension }}
            role={accessibleLabel ? 'img' : undefined}
            aria-label={accessibleLabel || undefined}
            aria-hidden={accessibleLabel ? undefined : true}
        >
            {/* El hueco reservado evita que el contenido salte al cargar. */}
            <Suspense fallback={null}>
                <DotLottieReact
                    src={`/lottie/fp-${name}.lottie`}
                    loop={!ONE_SHOT.includes(name)}
                    autoplay={!reduced}
                    style={{ width: '100%', height: '100%' }}
                />
            </Suspense>
        </div>
    )
}
