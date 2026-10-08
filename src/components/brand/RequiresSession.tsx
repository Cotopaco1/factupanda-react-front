import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PandaLottie } from '@/components/brand/PandaLottie'
import { SpeechBubble } from '@/components/brand/SpeechBubble'
import { useAuthDialogStore } from '@/stores/authDialog'
import { useUserStore } from '@/stores/userStore'
import type React from 'react'

interface Props {
    /** Que se pide hacer, para explicarlo en concreto. */
    what: string
    children: React.ReactNode
}

/**
 * Puerta de las pantallas que listan datos del tenant.
 *
 * Ninguna ruta del dashboard valida sesion, asi que un anonimo que llegara
 * aqui veia la pagina vacia y un toast "Error 401: Unauthenticated". Cotizar
 * sigue siendo libre; lo que exige cuenta es consultar lo guardado.
 */
export function RequiresSession({ what, children }: Props) {
    const isLogin = useUserStore((state) => state.isLogin)
    const sessionChecked = useUserStore((state) => state.sessionChecked)
    const openAuthDialog = useAuthDialogStore((state) => state.setIsOpen)

    /* Mientras se valida el token guardado no se decide nada: mostrar la
       invitacion aqui seria un parpadeo para quien si tiene sesion. */
    if (!sessionChecked) {
        return (
            <div className='flex flex-col gap-3'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-2/3' />
            </div>
        )
    }

    if (isLogin) return children

    return (
        <div className='flex flex-col items-center gap-4 py-10 sm:flex-row sm:justify-center sm:gap-6'>
            <PandaLottie name='vacio' size={150} label='' />

            <SpeechBubble className='max-w-sm px-6 py-5' tailClassName='top-12 hidden sm:block'>
                <p className='font-display text-xl'>Esto es solo para los tuyos</p>
                <p className='text-muted-foreground mt-1 text-sm'>
                    Crea tu cuenta o inicia sesión y {what} queda guardado aquí. Cotizar sigue
                    siendo gratis y sin cuenta. 🐼
                </p>
                <Button className='mt-4 w-full' onClick={() => openAuthDialog(true)}>
                    Iniciar sesión o registrarme
                </Button>
            </SpeechBubble>
        </div>
    )
}
