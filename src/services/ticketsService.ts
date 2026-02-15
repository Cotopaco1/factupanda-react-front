import { apiClient } from '@/lib/apiClient'
import type { CreateTicketPayload, TicketListItem, TicketStatus, TicketType } from '@/types/tickets'
import type { ApiResponse } from '@/types/responses'
import type { LaravelPaginator } from '@/types/paginator'

export const createTicket = async (data: CreateTicketPayload) => {
  const response = await apiClient.post<ApiResponse<{ ticket: unknown }>>('/tickets', data)
  return response.data
}

export type TicketsListFilters = {
  per_page?: number
  page?: number
  status?: TicketStatus
  type?: TicketType
}

export const listTickets = async (filters: TicketsListFilters = {}) => {
  const response = await apiClient.get<ApiResponse<LaravelPaginator<TicketListItem>>>('/tickets', { params: filters })
  return response.data
}
