import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PandaLottie } from '@/components/brand/PandaLottie'
import { SpeechBubble } from '@/components/brand/SpeechBubble'
import type { Celebration } from '@/services/milestones'
import { useAuthDialogStore } from '@/stores/authDialog'
import { XIcon } from 'lucide-react'

/** Se va solo, salvo cuando propone crear cuenta: ahi espera una decision. */
const AUTO_DISMISS_MS = 9000

interface Props {
    celebration: Celebration | null
    onClose: () => void
}

/**
 * Celebracion flotante, sin bloquear la pantalla.
 *
 * El panda felicita desde un bocadillo, el mismo que usa el contador de la
 * landing: cuando habla, habla en burbuja.
 */
export function CelebrationToast({ celebration, onClose }: Props) {
    /* Registrarse no es una ruta sino un dialogo, asi que se abre en sitio. */
    const openAuthDialog = useAuthDialogStore((state) => state.setIsOpen)
    const waitsForDecision = celebration?.cta === 'signup'

    useEffect(() => {
        if (!celebration || waitsForDecision) return

        const timer = setTimeout(onClose, AUTO_DISMISS_MS)

        return () => clearTimeout(timer)
    }, [celebration, waitsForDecision, onClose])

    if (!celebration) return null

    return (
        <div
            role='status'
            aria-live='polite'
            className='animate-in fade-in slide-in-from-right-6 motion-reduce:animate-none fixed top-16 right-4 z-50 flex items-start gap-1 duration-500'
        >
            <SpeechBubble
                className='w-[min(19rem,calc(100vw-9rem))] px-4 py-3'
                tailSide='right'
                tailClassName='top-9'
            >
                <div className='flex items-start gap-2'>
                    <div className='flex flex-1 flex-col gap-1'>
                        <p className='font-display text-lg leading-tight'>{celebration.title}</p>
                        <p className='text-muted-foreground text-sm leading-snug'>{celebration.body}</p>
                    </div>
                    <button
                        type='button'
                        aria-label='Cerrar aviso'
                        onClick={onClose}
                        className='text-muted-foreground hover:text-foreground shrink-0 cursor-pointer'
                    >
                        <XIcon className='size-4' />
                    </button>
                </div>
                {waitsForDecision && (
                    <Button
                        size='sm'
                        className='mt-3 w-full'
                        onClick={() => {
                            onClose()
                            openAuthDialog(true)
                        }}
                    >
                        Crear mi cuenta
                    </Button>
                )}
            </SpeechBubble>

            <PandaLottie name='listo' size={92} label='' className='-mt-2' />
        </div>
    )
}
