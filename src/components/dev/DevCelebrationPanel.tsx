import { useState } from 'react'
import { celebrationFor, type Celebration } from '@/services/milestones'

const CASOS: { etiqueta: string; count: number; logueado: boolean }[] = [
    { etiqueta: 'Anónimo · 3', count: 3, logueado: false },
    { etiqueta: 'Hito 10', count: 10, logueado: true },
    { etiqueta: 'Hito 25', count: 25, logueado: true },
    { etiqueta: 'Hito 50', count: 50, logueado: true },
    { etiqueta: 'Hito 100', count: 100, logueado: true },
    { etiqueta: 'Hito 500', count: 500, logueado: true },
]

/**
 * Panel para revisar las celebraciones sin generar cotizaciones de verdad ni
 * manipular localStorage a mano. Solo existe en desarrollo.
 */
export function DevCelebrationPanel({ onShow }: { onShow: (c: Celebration) => void }) {
    const [abierto, setAbierto] = useState(false)

    if (!import.meta.env.DEV) return null

    const disparar = (count: number, logueado: boolean) => {
        const real = celebrationFor(count, logueado)

        /* Si ya se vio o esta en enfriamiento, se fuerza igualmente: aqui el
           objetivo es revisar el diseño, no respetar las reglas. */
        onShow(
            real ?? {
                id: `dev-${count}`,
                title: `Hito ${count}`,
                body: 'Versión forzada: en uso real ya se mostró o está en enfriamiento.',
            },
        )
    }

    return (
        <div className='fixed bottom-4 left-4 z-50 text-xs'>
            {abierto ? (
                <div className='bg-background flex flex-col gap-1 rounded-lg border p-3 shadow-lg'>
                    <div className='mb-1 flex items-center justify-between gap-4'>
                        <span className='font-semibold'>Celebraciones (dev)</span>
                        <button type='button' onClick={() => setAbierto(false)} className='cursor-pointer'>
                            ✕
                        </button>
                    </div>
                    {CASOS.map((caso) => (
                        <button
                            key={caso.etiqueta}
                            type='button'
                            onClick={() => disparar(caso.count, caso.logueado)}
                            className='hover:bg-muted cursor-pointer rounded px-2 py-1 text-left'
                        >
                            {caso.etiqueta}
                        </button>
                    ))}
                    <button
                        type='button'
                        onClick={() => {
                            localStorage.removeItem('fp.celebrated')
                            localStorage.removeItem('fp.celebrated_at')
                        }}
                        className='text-muted-foreground mt-1 cursor-pointer rounded px-2 py-1 text-left'
                    >
                        Reiniciar historial
                    </button>
                </div>
            ) : (
                <button
                    type='button'
                    onClick={() => setAbierto(true)}
                    className='bg-background cursor-pointer rounded-full border px-3 py-1 shadow'
                >
                    🐼 dev
                </button>
            )}
        </div>
    )
}
