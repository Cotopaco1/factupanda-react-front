import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { DashboardLayout, type BreadcrumbItemType } from '@/components/layouts/DashboardLayout'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useUserStore } from '@/stores/userStore'
import { TicketsTable } from '@/components/tickets/TicketsTable'
import { FormSelect } from '@/components/form/FormSelect'
import { useForm } from 'react-hook-form'

type TicketsIndexSearch = {
  per_page: number
  page: number
  status?: string
}

export const Route = createFileRoute('/dashboard/tickets/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): TicketsIndexSearch => {
    return {
      page: Number(search?.page ?? 1),
      per_page: Number(search?.per_page ?? 15),
      status: typeof search?.status === 'string' ? search.status : undefined,
    }
  }
})

const breadcrumb: BreadcrumbItemType[] = [
  {
    label: 'Tickets',
    to: '.'
  }
]

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'open', label: 'Abierto' },
  { value: 'triaged', label: 'En revision' },
  { value: 'resolved', label: 'Resuelto' },
]

function RouteComponent() {
  useDocumentTitle('Tickets')
  const { page, per_page, status } = Route.useSearch()
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)

  const form = useForm<{ status: string }>({
    defaultValues: {
      status: status ?? ''
    }
  })

  const selectedStatus = form.watch('status')

  useEffect(() => {
    form.reset({ status: status ?? '' })
  }, [form, status])

  useEffect(() => {
    if (selectedStatus === (status ?? '')) return
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        page: 1,
        status: selectedStatus || undefined,
      }),
    })
  }, [navigate, selectedStatus, status])

  if (!user?.is_admin) {
    return (
      <DashboardLayout title='Tickets' description='Listado de tickets' breadcrumb={breadcrumb}>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <p className='text-lg font-semibold'>No autorizado</p>
            <p className='text-muted-foreground'>No tienes permisos para ver esta pagina.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title='Tickets' description='Listado de tickets' breadcrumb={breadcrumb}>
      <div className='grid gap-4'>
        <div className='max-w-xs'>
          <FormSelect
            name='status'
            control={form.control}
            label='Estado'
            options={statusOptions}
            optionLabel='label'
            optionValue='value'
          />
        </div>
        <TicketsTable page={page} perPage={per_page} status={status as 'open' | 'triaged' | 'resolved' | undefined} />
      </div>
    </DashboardLayout>
  )
}
