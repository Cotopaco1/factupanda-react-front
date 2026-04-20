import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const announcementDate = '4/19/2026'

export function UpdatesDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full justify-start gap-2 py-5 text-sm'>
          <Star className='size-4.5' />
          Anuncios
          <span className='text-xs text-muted-foreground'>({announcementDate})</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            Anuncios <span className='text-sm font-normal text-muted-foreground'>{announcementDate}</span>
          </DialogTitle>
          <DialogDescription className='text-sm leading-6'>
            Compartimos una mejora reciente en la creación y configuración de cotizaciones.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 text-base leading-7 text-foreground'>
          <p>
            Ahora puedes elegir la moneda al crear una cotización usando un
            catálogo centralizado de divisas.
          </p>
          <p>
            También habilitamos la moneda predeterminada dentro de la
            configuración de tu empresa para reutilizarla en futuras
            cotizaciones.
          </p>
          <p className='font-medium text-muted-foreground'>
            Los montos ahora respetan mejor el formato decimal según la moneda
            seleccionada.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
