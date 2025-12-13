import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/generar-cotizacion')({
    beforeLoad: () => {
    throw redirect({
      to: '/dashboard/quotation/create',
      replace: true,
    })
  },
})
