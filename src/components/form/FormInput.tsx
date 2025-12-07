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
    required ?: boolean;
}

export function FormInput({type= 'text', label, control, name, placeholder='', className, required = false}:Props){

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    <FieldLabel htmlFor={name}>{label} {required && <span className="text-destructive">*</span>} </FieldLabel>
                    <Input 
                        {...field} 
                        type={type} 
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                        id={name}
                        required={required}
                    />
                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]}/>
                    )}
                </Field>
            )}
        />
    )
}