import { Input } from "../ui/input";
import { Controller ,type Control } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import type { HTMLInputTypeAttribute } from "react";

interface Props {
    type  : HTMLInputTypeAttribute;
    label : string;
    control : Control<any>;
    name : string;
    placeholder ?: string;
    className ?: string;
}

export function FormInput({type= 'text', label, control, name, placeholder='', className}:Props){

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <Input 
                        {...field} 
                        type={type} 
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                        id={name}
                    />
                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]}/>
                    )}
                </Field>
            )}
        />
    )
}