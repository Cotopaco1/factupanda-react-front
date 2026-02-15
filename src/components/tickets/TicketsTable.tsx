import { useEffect, useMemo, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TablePagination } from '@/components/TablePagination'
import { Badge } from '@/components/ui/badge'
import { listTickets, type TicketsListFilters } from '@/services/ticketsService'
import type { LaravelPaginator } from '@/types/paginator'
import type { TicketListItem } from '@/types/tickets'

type TicketsTableProps = {
  page: number
  perPage: number
  status?: TicketsListFilters['status']
}

const statusLabels: Record<string, string> = {
  open: 'Abierto',
  triaged: 'En revision',
  resolved: 'Resuelto',
}

const statusVariant: Record<string, 'default' | 'warning' | 'success'> = {
  open: 'default',
  triaged: 'warning',
  resolved: 'success',
}

const typeLabels: Record<string, string> = {
  bug: 'Error',
  suggestion: 'Sugerencia',
  message: 'Mensaje',
}

export function TicketsTable({ page, perPage, status }: TicketsTableProps) {
  const [paginator, setPaginator] = useState<LaravelPaginator<TicketListItem>>()
  const [loading, setLoading] = useState(true)

  const filters = useMemo(() => ({
    page,
    per_page: perPage,
    status: status || undefined,
  }), [page, perPage, status])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    listTickets(filters).then((response) => {
      if (!mounted) return
      setPaginator(response.data)
    }).finally(() => {
      if (!mounted) return
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [filters])

  if (loading) return <p className='p-4'>Cargando...</p>

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[80px]'>ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Titulo</TableHead>
            <TableHead>Mensaje</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginator?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className='text-center text-muted-foreground py-8'>
                No hay tickets registrados
              </TableCell>
            </TableRow>
          )}
          {paginator?.data.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className='font-medium'>#{ticket.id}</TableCell>
              <TableCell>{typeLabels[ticket.type] ?? ticket.type}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[ticket.status] ?? 'secondary'}>
                  {statusLabels[ticket.status] ?? ticket.status}
                </Badge>
              </TableCell>
              <TableCell className='max-w-[160px] truncate'>{ticket.title || 'Sin titulo'}</TableCell>
              <TableCell className='max-w-[260px] truncate'>{ticket.message}</TableCell>
              <TableCell>{new Date(ticket.created_at).toLocaleDateString('es-CO')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='mt-4'>
        <TablePagination paginator={paginator} />
      </div>
    </div>
  )
}
