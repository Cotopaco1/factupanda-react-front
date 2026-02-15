import { z } from "zod";

export const productCreateSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().optional(),
    unit_of_measurement: z.string().min(1, "La unidad de medida es obligatoria"),
    unit_price: z.coerce.number().min(1, "El precio debe ser mayor o igual a 1"),
    discount_percentage: z.coerce.number().min(0).max(100).optional(),
    tax_percentage: z.coerce.number().min(0).max(100).optional(),
});

export type ProductCreateFormInput = z.input<typeof productCreateSchema>
export type ProductCreateForm = z.output<typeof productCreateSchema>

export const productSchema = productCreateSchema;
