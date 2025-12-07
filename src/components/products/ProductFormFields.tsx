import { type Control } from "react-hook-form";
import { FormInput } from "../form/FormInput";
import type { ProductForm } from "@/schemas/quotation";

interface Props {
    control : Control<ProductForm>
}

export function ProductFormFields({control}:Props){
    return (
        <>
            <FormInput name="name" control={control} label="Nombre" type="text" placeholder="Pantalón" required/>
            <FormInput name="description" control={control} label="Descripción" type="text" placeholder="2XL"/>
            <FormInput name="unit_of_measurement" control={control} label="Unidad de Medida" type="text" placeholder="unidad" required/>
            <FormInput name="unit_price" control={control} label="Precio unitario" type="text" placeholder="unidad" required/>
            <FormInput name="quantity" control={control} label="Cantidad" type="number" placeholder="2" required/>
            <FormInput name="discount_percentage" control={control} label="Descuento(%)" type="number" placeholder="10"/>
            <FormInput name="tax_percentage" control={control} label="Impuesto(%)" type="number" placeholder="19"/>
        </>
    )
}