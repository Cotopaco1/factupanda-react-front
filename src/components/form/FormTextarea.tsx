import { Controller ,type Control } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Textarea } from "../ui/textarea";

interface Props {
    label : string;
    control : Control<any>;
    name : string;
    placeholder ?: string;
    className ?: string;
    required ?: boolean;
}

export function FormTextarea({label, control, name, placeholder='', className, required = false}:Props){

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    <FieldLabel htmlFor={name}>{label} {required && <span className="text-destructive">*</span>} </FieldLabel>
                    <Textarea 
                        {...field}
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