import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../../components/ui/button'

export const Route = createFileRoute('/dashboard/quotation/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Button>Hola ! esto es un boton desde Quotation Create</Button>
  )
}
