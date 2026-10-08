import { apiClient } from '@/lib/apiClient'
import { useCountUp } from '@/hooks/useCountUp'
import { useEffect, useState } from 'react'
import { PandaLottie } from '@/components/brand/PandaLottie'
import { SpeechBubble } from '@/components/brand/SpeechBubble'

/**
 * Solo en desarrollo: ?total=99999 fuerza la cifra para poder ver la animacion
 * con cualquier numero sin tocar la base de datos.
 */
const forcedTotal = (): number | null => {
    if (!import.meta.env.DEV) return null

    const raw = new URLSearchParams(window.location.search).get('total')
    const parsed = Number(raw)

    return raw !== null && Number.isFinite(parsed) ? parsed : null
}

/**
 * Franja de prueba social con el acumulado de la plataforma.
 *
 * Ocupa su propia banda a todo el ancho y no una tarjeta dentro del hero: la
 * cifra es un argumento de venta, no una nota al pie.
 *
 * Si la peticion falla no se renderiza nada, porque mostrar un cero diria
 * justo lo contrario de lo que queremos transmitir.
 */
/**
 * Redondea a la centena inferior y antepone "+", porque la cifra exacta no
 * aporta nada y envejece peor: "+24.400" sigue siendo cierto manana.
 *
 * Por debajo de 100 se muestra el numero exacto sin "+", ya que redondear
 * daria "+0" y diria lo contrario de lo que queremos transmitir.
 */
const roundDownToHundred = (total: number): { value: number; prefix: string } =>
    total >= 100
        ? { value: Math.floor(total / 100) * 100, prefix: '+' }
        : { value: total, prefix: '' }

export function QuotationsGeneratedCounter() {
    const [total, setTotal] = useState<number | null>(forcedTotal)
    const display = total === null ? null : roundDownToHundred(total)
    const animated = useCountUp(display?.value ?? null)

    useEffect(() => {
        if (forcedTotal() !== null) return

        let mounted = true

        apiClient
            .get<{ total: number }>('/quotations/generated-total', { skipGlobalError: true })
            .then((response) => {
                if (mounted) setTotal(response.data.total)
            })
            .catch(() => {
                if (mounted) setTotal(null)
            })

        return () => {
            mounted = false
        }
    }, [])

    if (display === null || display.value <= 0) return null

    return (
        <section className='flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-6'>
            <PandaLottie name='reposo' size={140} label='' />

            {/* El panda dice la cifra, en vez de que la cifra lleve una
                explicacion al lado. */}
            <SpeechBubble className='px-7 py-5 text-center' tailClassName='top-12 hidden sm:block'>
                <p className='text-highlight font-display text-5xl leading-none tabular-nums sm:text-6xl'>
                    {display.prefix}
                    {animated.toLocaleString('es')}
                </p>
                <p className='mt-1 text-base font-medium'>
                    cotizaciones creadas. ¡Y seguimos! 🐼
                </p>
            </SpeechBubble>
        </section>
    )
}
