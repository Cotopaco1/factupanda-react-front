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

const announcementDate = '3/23/2026'

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
            Compartimos una mejora reciente en la infraestructura de la plataforma.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 text-base leading-7 text-foreground'>
          <p>
            Hemos migrado parte de nuestros servicios con el objetivo de mejorar
            el rendimiento general de la plataforma y responder mejor al
            crecimiento del tráfico.
          </p>
          <p>
            En algunos momentos, ese aumento de visitas podía hacer que ciertas
            páginas se sintieran lentas e incluso presentaran fallos
            intermitentes. Con esta actualización buscamos una experiencia más
            estable, rápida y confiable.
          </p>
          <p className='font-medium text-muted-foreground'>
            Son problemas que, en el fondo, también nos alegran: significan que
            cada vez más personas están usando FactuPanda.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
