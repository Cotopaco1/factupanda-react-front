import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { PandaLottie } from '@/components/brand/PandaLottie'

interface Props {
    open: boolean
}

/**
 * Espera mientras el API arma el PDF.
 *
 * Antes solo giraba un spinner dentro del boton, asi que no quedaba claro que
 * algo estuviera pasando. No se puede cerrar a proposito: cerrarla no
 * cancelaria la peticion y daria la impresion de que si.
 */
export function DialogGeneratingQuotation({ open }: Props) {
    return (
        <Dialog open={open}>
            <DialogContent
                className='max-w-sm [&>button]:hidden'
                onPointerDownOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                <DialogTitle className='sr-only'>Generando tu cotización</DialogTitle>
                <div className='flex flex-col items-center gap-3 py-4 text-center'>
                    <PandaLottie name='generando' size={180} label='' />
                    <p className='text-lg font-semibold'>Armando tu cotización</p>
                    <p className='text-muted-foreground text-sm'>
                        Dame un segundo, ya casi la tengo. 🐼
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
