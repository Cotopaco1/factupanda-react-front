import type React from 'react'
import { cn } from '@/lib/utils'

interface Props {
    children: React.ReactNode
    className?: string
    /** Lado por el que sale la cola, es decir donde esta el panda. */
    tailSide?: 'left' | 'right'
    /**
     * Posicion y visibilidad de la cola. Se expone porque depende de donde
     * quede el panda: a su altura cuando estan en fila, oculta cuando el
     * bloque se apila y la cola no tendria a que apuntar.
     */
    tailClassName?: string
}

/*
 * Un cuadrado girado 45 grados con borde en dos lados deja una punta. Que
 * bordes se pintan decide hacia donde apunta.
 */
const TAIL_SIDE = {
    left: '-left-[11px] border-b-[3px] border-l-[3px]',
    right: '-right-[11px] border-t-[3px] border-r-[3px]',
} as const

/**
 * Bocadillo con el estilo sticker de la marca.
 *
 * La cola es un cuadrado rotado 45 grados con borde en dos lados, superpuesto
 * al borde de la burbuja para taparlo. Es lo que hace que el panda parezca
 * estar hablando en vez de tener un cartel al lado.
 */
export function SpeechBubble({ children, className, tailSide = 'left', tailClassName }: Props) {
    return (
        <div
            className={cn(
                'bg-card border-sticker-ink relative rounded-3xl border-[3px] shadow-[6px_6px_0_var(--sticker-ink)]',
                className,
            )}
        >
            <span
                aria-hidden='true'
                className={cn(
                    'border-sticker-ink bg-card absolute size-5 rotate-45',
                    TAIL_SIDE[tailSide],
                    tailClassName,
                )}
            />
            {children}
        </div>
    )
}
