import { z } from 'zod'

export const ticketSchema = z.object({
  type: z.enum(['bug', 'suggestion', 'message']),
  title: z.string().max(200).optional().or(z.literal('')),
  message: z.string().min(1, 'El mensaje es obligatorio').max(5000),
})

export type TicketFormValues = z.infer<typeof ticketSchema>
