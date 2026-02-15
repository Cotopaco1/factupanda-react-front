import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { createTicket } from '@/services/ticketsService'
import { ticketSchema, type TicketFormValues } from '@/schemas/ticket'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { FormTextarea } from '@/components/form/FormTextarea'

const typeOptions = [
  { value: 'bug', label: 'Error' },
  { value: 'suggestion', label: 'Sugerencia' },
  { value: 'message', label: 'Mensaje' },
]

export function ReportTicketDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm<TicketFormValues>({
    defaultValues: {
      type: 'bug',
      title: '',
      message: '',
    },
    resolver: zodResolver(ticketSchema),
  })

  const metadata = useMemo(() => {
    if (typeof window === 'undefined') return undefined
    return {
      url: window.location.href,
      user_agent: window.navigator.userAgent,
    }
  }, [])

  const onSubmit = async (data: TicketFormValues) => {
    try {
      await createTicket({
        type: data.type,
        title: data.title || undefined,
        message: data.message,
        metadata,
      })
      toast.success('Ticket enviado')
      form.reset()
      setOpen(false)
    } catch {
      toast.error('No se pudo enviar el ticket')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full justify-start gap-2'>
          <MessageCircle className='size-4' />
          Reportar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Reportar problema/sugerencia</DialogTitle>
          <DialogDescription>
            Comparte un error, una sugerencia o un mensaje para mejorar la aplicacion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <FormSelect
            name='type'
            control={form.control}
            label='Tipo'
            options={typeOptions}
            optionLabel='label'
            optionValue='value'
          />
          <FormInput
            name='title'
            control={form.control}
            label='Titulo (opcional)'
            type='text'
            placeholder='Ej: El boton guardar no funciona'
          />
          <FormTextarea
            name='message'
            control={form.control}
            label='Mensaje'
            placeholder='Describe el problema o sugerencia'
            required
          />
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type='submit'>Enviar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
