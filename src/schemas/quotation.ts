import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  unit_of_measurement : z.string().min(1, "La unidad de medida es obligatoria"),
  unit_price: z.coerce.number().min(1, "El precio debe ser mayor o igual a 1"),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1"),
  discount_percentage: z.coerce.number().min(0).max(100).optional(), // porcentaje, por ejemplo
  tax_percentage: z.coerce.number().min(0).max(100).optional(),
})

export type ProductFormInput = z.input<typeof productSchema>
export type ProductForm = z.output<typeof productSchema>


export const quotationSchema = z.object({
    number: z
        .string()
        .min(1, "El número de cotización es obligatorio"),

    date: z
        .string()
        .min(1, "La fecha es obligatoria"),

    // El select devuelve string, pero tus opciones tienen value numérico.
    // Coercemos a number para que Zod convierta "1" -> 1
    due_date_id: z.coerce
        .number()
        .int()
        .positive("Debes seleccionar una fecha de vencimiento"),

    temporary_logo: z.string().optional().nullable(),
    use_tenant_logo: z.boolean().optional(),
    primaryColor : z.string().min(1, "El color es obligatorio"),
    secundaryColor : z.string().min(1, "El color es obligatorio"),

    // Por ahora los dejamos muy flex, luego los afinamos
    company: z
        .object({
        name: z.string().min(1, "El nombre es obligatorio"),
        address: z.string().optional(),
        city: z.string().optional(),
        fiscal_number: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        })
        .optional(),
    code : z.string().min(1, "El codigo de pais es obligatorio"),

    client: z
        .object({
        name: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        fiscal_number: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        })
        .optional(),
    products: z
        .array(productSchema)
        .min(1, "Debes agregar al menos un producto"),
    notes : z.string().optional(),
    terms : z.string().optional(),
    template: z.string().optional(),
})

export type QuotationType = z.infer<typeof quotationSchema>

export const quotationEditSchema = z.object({
    number: z.string().min(1, "El número de cotización es obligatorio"),
    date: z.string().min(1, "La fecha es obligatoria"),
    due_date: z.string().min(1, "La fecha de vencimiento es obligatoria"),
    currency: z.string().min(1, "La moneda es obligatoria"),
    locale: z.enum(['en', 'es']),
    notes: z.string().optional().nullable(),
    terms: z.string().optional().nullable(),
    discount: z.coerce.number().min(0).optional(),
    is_flat_discount: z.boolean().optional(),
    tax: z.coerce.number().min(0).max(100).optional(),
    client: z.object({
        name: z.string().min(1, "El nombre del cliente es obligatorio"),
        fiscal_number: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        email: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
    }),
    company: z.object({
        name: z.string().min(1, "El nombre de la empresa es obligatorio"),
        fiscal_number: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        email: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
    }),
    products: z.array(productSchema).min(1, "Debes agregar al menos un producto"),
})

export type QuotationEditForm = z.infer<typeof quotationEditSchema>
