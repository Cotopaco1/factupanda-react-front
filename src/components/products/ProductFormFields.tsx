import { type Control } from "react-hook-form";
import { FormInput } from "../form/FormInput";
import { FormAmountInput } from "../form/FormAmountInput";
import type { ProductFormInput } from "@/schemas/quotation";

interface Props {
    control : Control<ProductFormInput>
}

export function ProductFormFields({control}:Props){
    return (
        <>
            <FormInput name="name" control={control} label="Nombre" type="text" placeholder="Pantalón" required/>
            <FormInput name="description" control={control} label="Descripción" type="text" placeholder="2XL"/>
            <FormInput name="unit_of_measurement" control={control} label="Unidad de Medida" type="text" placeholder="unidad" required/>
            <FormAmountInput name="unit_price" control={control} label="Precio unitario" placeholder="1500,00" required/>
            <FormInput name="quantity" control={control} label="Cantidad" type="number" placeholder="2" required/>
            <FormInput name="discount_percentage" control={control} label="Descuento(%)" type="number" placeholder="10"/>
            <FormInput name="tax_percentage" control={control} label="Impuesto(%)" type="number" placeholder="19"/>
        </>
    )
}
