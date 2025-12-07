import { Input } from "../ui/input";
import { Controller ,type Control } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import type { HTMLInputTypeAttribute } from "react";

interface Props {
    label : string;
    control : Control<any>;
    name : string;
    placeholder ?: string;
    className ?: string;
    required ?: boolean;
}

export function FormColorInput({label, control, name, className, required = false}:Props){

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className={`${className}`} orientation="horizontal" >
                    <Input 
                        {...field} 
                        type='color'
                        aria-invalid={fieldState.invalid}
                        id={name}
                        required={required}
                        className="max-w-[50px]"
                    />
                    <FieldLabel htmlFor={name}>{label} {required && <span className="text-destructive">*</span>} </FieldLabel>
                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]}/>
                    )}
                </Field>
            )}
        />
    )
}