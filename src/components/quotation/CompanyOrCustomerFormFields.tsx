import type { Control } from "react-hook-form";
import { FieldGroup } from "../ui/field";
import { FormInput } from "../form/FormInput";

interface Props {
    suffix : string;
    control : Control<any>;
}

export function CompanyOrCustomerFormField({suffix, control}:Props){

    return (
        <FieldGroup className="grid md:grid-cols-2">
            <FormInput name={`${suffix}.name`} control={control} label="Nombre" type="text" required/>
            <FormInput name={`${suffix}.address`} control={control} label="Dirección" type="text"/>
            <FormInput name={`${suffix}.city`} control={control} label="Ciudad" type="text"/>
            <FormInput name={`${suffix}.fiscal_number`} control={control} label="Numero Fiscal" type="text"/>
            <FormInput name={`${suffix}.email`} control={control} label="Correo Electronico" type="email"/>
            <FormInput name={`${suffix}.phone`} control={control} label="Telefono" type="text"/>
        </FieldGroup>
    )


}