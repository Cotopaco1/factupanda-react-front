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

const updates = [
  'Correción de error 500, al subir un logo y pasar mucho tiempo en la pagina.',
  'Nuevo sistema de monitoreo de errores, ahora es mas facil detectarlos y arreglarlos',
  'En desarrollo : Selector de separador de decimales.',
]

export function UpdatesDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full justify-start gap-2'>
          <Star className='size-4' />
          Novedades
          <span className='text-xs'> (3/09/2026) </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Novedades <span className='text-xs text-muted-foreground'>3/9/2026</span> </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className='grid gap-3 text-sm text-muted-foreground'>
          <ul className='list-disc pl-4 text-foreground'>
            {updates.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>Sus reportes han sido utiles, ¡gracias!</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
