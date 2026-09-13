import { Input } from "../ui/input";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { normalizeAmountInput } from "@/lib/amount";

interface Props<T extends FieldValues> {
    label : string;
    control : Control<T>;
    name : Path<T>;
    placeholder ?: string;
    className ?: string;
    required ?: boolean;
}

/**
 * Campo de importe tolerante al formato local. Se deja escribir "1.500,00" o
 * "1,500.50" y al salir del campo se muestra ya normalizado, para que el
 * usuario vea con qué número se va a quedar la cotización.
 */
export function FormAmountInput<T extends FieldValues>({label, control, name, placeholder='', className, required = false}: Props<T>){

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    <FieldLabel htmlFor={name}>{label} {required && <span className="text-destructive">*</span>} </FieldLabel>
                    <Input
                        {...field}
                        value={field.value ?? ''}
                        onBlur={() => {
                            if (typeof field.value === 'string') {
                                const normalized = normalizeAmountInput(field.value)
                                if (normalized !== '') field.onChange(normalized)
                            }
                            field.onBlur()
                        }}
                        type="text"
                        inputMode="decimal"
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
