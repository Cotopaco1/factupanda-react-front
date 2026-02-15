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
  'Nueva pagina de Mis Cotizaciones para gestionar tus registros.',
  'Configuracion con carga rapida de datos pre-guardados.',
  'Reporte de errores/sugerencias para mejorar la aplicación',
]

export function UpdatesDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full justify-start gap-2'>
          <Star className='size-4' />
          Novedades
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Novedades</DialogTitle>
          <DialogDescription>Lo nuevo en esta actualizacion.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-3 text-sm text-muted-foreground'>
          <ul className='list-disc pl-4 text-foreground'>
            {updates.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
