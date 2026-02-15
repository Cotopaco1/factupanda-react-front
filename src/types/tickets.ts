export type TicketType = 'bug' | 'suggestion' | 'message'

export type TicketStatus = 'open' | 'triaged' | 'resolved'

export type TicketMetadata = {
  url?: string
  user_agent?: string
  app_version?: string
}

export type CreateTicketPayload = {
  type: TicketType
  title?: string
  message: string
  metadata?: TicketMetadata
}

export type TicketListItem = {
  id: number
  tenant_id: number | null
  user_id: number | null
  type: TicketType
  title: string | null
  message: string
  metadata: TicketMetadata | null
  status: TicketStatus
  created_at: string
  updated_at: string
}
