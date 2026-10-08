import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

/**
 * Anima un numero de 0 al valor final.
 *
 * Quien pidio menos movimiento recibe la cifra final directamente. Ese caso se
 * resuelve en el valor de retorno y no con un setState dentro del efecto, que
 * provocaria un render en cascada.
 */
export function useCountUp(target: number | null, durationMs = 1600): number {
    /* Es un valor que decide lo que se pinta, asi que vive en estado y no en un
       ref: leer un ref durante el render no esta permitido. */
    const [reduced] = useState(prefersReducedMotion)
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (target === null || target <= 0 || reduced) return

        const start = performance.now()
        let frame = 0

        const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1)
            /* easeOutCubic: arranca rapido y frena al final. */
            const eased = 1 - Math.pow(1 - progress, 3)

            setValue(Math.round(target * eased))

            if (progress < 1) frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)

        return () => cancelAnimationFrame(frame)
    }, [target, durationMs, reduced])

    if (target === null) return 0
    if (reduced) return target

    return value
}
