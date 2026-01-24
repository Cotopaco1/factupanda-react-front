import { Controller ,type Control } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
interface SelectOption {
  [key: string]: any;
}

interface Props {
  label: React.ReactNode;
  control: Control<any>;
  name: string;
  options: SelectOption[];
  optionLabel: string;
  optionValue: string;
  className ?: string;
}

export function FormSelect({label, control, name, options, optionValue, optionLabel, className}:Props){

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <NativeSelect
                        {...field} 
                        aria-invalid={fieldState.invalid}
                        id={name}
                    >
                        <NativeSelectOption value="">Selecciona una opción</NativeSelectOption>
                        {options.map(option => (
                            <NativeSelectOption  key={option[optionValue]} value={option[optionValue]} >{option[optionLabel]}</NativeSelectOption>
                        ))}
                    </NativeSelect>

                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]}/>
                    )}
                </Field>
            )}
        />
    )
}