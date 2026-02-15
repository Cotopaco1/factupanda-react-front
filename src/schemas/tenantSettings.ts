import { z } from "zod"

export const tenantSettingsCompanySchema = z.object({
    name: z.string().max(255).optional(),
    address: z.string().max(255).optional(),
    phone: z.string().max(50).optional(),
    city: z.string().max(100).optional(),
    fiscal_number: z.string().max(100).optional(),
    email: z.string().email("Ingresa un email válido").optional().or(z.literal('')),
})

export const tenantSettingsSchema = z.object({
    logo_url: z.string().url("Ingresa una URL válida").optional().or(z.literal('')).nullable(),
    primary_color: z.string().max(20).optional().nullable(),
    secondary_color: z.string().max(20).optional().nullable(),
    template: z.enum(['classic', 'executive', 'modern']).optional(),
    currency: z.string().length(3, "El código de moneda debe tener 3 caracteres").optional().or(z.literal('')),
    locale: z.string().max(5).optional(),
    company: tenantSettingsCompanySchema.optional(),
    quotation: z.object({
        notes_default: z.string().max(2000).optional().or(z.literal('')),
        terms_default: z.string().max(2000).optional().or(z.literal('')),
    }).optional(),
})

export type TenantSettingsForm = z.infer<typeof tenantSettingsSchema>
