import { apiClient } from '@/lib/apiClient'
import { useCountUp } from '@/hooks/useCountUp'
import { useEffect, useState } from 'react'
import pandaAvatar from '@/assets/avatar-panda.png'

/**
 * Prueba social con el contador acumulado de la plataforma.
 *
 * Si la peticion falla no se renderiza nada: es mejor no mostrar el bloque que
 * mostrar un cero, que diria justo lo contrario de lo que queremos transmitir.
 */
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

export function QuotationsGeneratedCounter() {
    const [total, setTotal] = useState<number | null>(forcedTotal)
    const animated = useCountUp(total)

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

    if (total === null || total <= 0) return null

    return (
        <div className='bg-secondary flex items-center gap-4 rounded-lg p-4 md:p-6'>
            <img
                src={pandaAvatar}
                alt=''
                aria-hidden='true'
                className='size-14 shrink-0 md:size-16'
            />
            <p className='text-sm md:text-base'>
                <span className='text-highlight block text-3xl font-bold tabular-nums md:text-4xl'>
                    {animated.toLocaleString('es')}
                </span>
                cotizaciones ya generadas en Factupanda. ¡Este panda no para! 🐼
            </p>
        </div>
    )
}
