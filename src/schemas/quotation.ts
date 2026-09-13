import { z } from "zod"
import { parseAmountInput } from "@/lib/amount"

// Estas reglas deben reflejar QuotationStoreRequest del API: cualquier diferencia
// produce un 422 sobre `products.*`, que la tabla de productos no puede pintar.
const MAX_TEXT_LENGTH = 255
const MAX_AMOUNT = 9999999999

const percentageSchema = z.coerce
  .number()
  .min(0, "El porcentaje no puede ser negativo")
  .max(100, "El porcentaje no puede superar 100")
  .multipleOf(0.01, "Máximo 2 decimales")

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(MAX_TEXT_LENGTH, `Máximo ${MAX_TEXT_LENGTH} caracteres`),
  description: z.string().max(MAX_TEXT_LENGTH, `Máximo ${MAX_TEXT_LENGTH} caracteres`).optional(),
  unit_of_measurement : z.string().min(1, "La unidad de medida es obligatoria").max(MAX_TEXT_LENGTH, `Máximo ${MAX_TEXT_LENGTH} caracteres`),
  // El preprocess cubre el envío con Enter, cuando el campo aún no perdió el foco.
  unit_price: z.preprocess(
    parseAmountInput,
    z.coerce
      .number({ error: "Ingresa un precio válido" })
      .min(1, "El precio debe ser mayor o igual a 1")
      .max(MAX_AMOUNT, "El precio supera el máximo permitido")
      .multipleOf(0.01, "Máximo 2 decimales"),
  ),
  quantity: z.coerce
    .number()
    .int("La cantidad debe ser un número entero")
    .min(1, "La cantidad debe ser al menos 1")
    .max(MAX_AMOUNT, "La cantidad supera el máximo permitido"),
  discount_percentage: percentageSchema.default(0),
  tax_percentage: percentageSchema.default(0),
})

export type ProductFormInput = z.input<typeof productSchema>
export type ProductForm = z.output<typeof productSchema>


const optionalText = z
  .string()
  .max(MAX_TEXT_LENGTH, `Máximo ${MAX_TEXT_LENGTH} caracteres`)
  .optional()

const partySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(MAX_TEXT_LENGTH, `Máximo ${MAX_TEXT_LENGTH} caracteres`),
  address: optionalText,
  city: optionalText,
  fiscal_number: optionalText,
  phone: optionalText,
  email: z
    .union([z.literal(""), z.email("Correo electrónico inválido").max(MAX_TEXT_LENGTH)])
    .optional(),
})

export const quotationSchema = z.object({
    number: z
        .string()
        .min(1, "El número de cotización es obligatorio"),

    date: z
        .string()
        .min(1, "La fecha es obligatoria"),

    // El select devuelve string, pero tus opciones tienen value numerico.
    // Coercemos a number para que Zod convierta "1" -> 1.
    due_date_id: z.coerce
        .number()
        .int()
        .positive("Debes seleccionar una fecha de vencimiento"),
    currency: z.string().length(3, "La moneda es obligatoria"),

    temporary_logo: z.string().optional().nullable(),
    use_tenant_logo: z.boolean().optional(),
    primaryColor : z.string().min(1, "El color es obligatorio"),
    secundaryColor : z.string().min(1, "El color es obligatorio"),

    company: partySchema,
    client: partySchema,
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
