import type React from 'react'

interface Props {
    title: string
    updatedAt: string
    children: React.ReactNode
}

/**
 * Maqueta compartida de las paginas legales. Tipografia del sistema y ancho de
 * lectura acotado: aqui manda la legibilidad, no el estilo sticker.
 */
export function LegalPage({ title, updatedAt, children }: Props) {
    return (
        <article className='flex max-w-2xl flex-col gap-6'>
            <header className='flex flex-col gap-1'>
                <h1 className='font-display text-3xl'>{title}</h1>
                <p className='text-muted-foreground text-sm'>Última actualización: {updatedAt}</p>
            </header>
            <div className='flex flex-col gap-6 leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_section]:flex [&_section]:flex-col [&_section]:gap-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1'>
                {children}
            </div>
        </article>
    )
}
