import type { UseFormReturn } from "react-hook-form";
import { FieldError } from "../ui/field";

interface Props {
    form : UseFormReturn<any>
    className ?: string;
}

export function FormRootErrorMessage({form, className}:Props){
    if(form.formState.errors?.root){
        return <FieldError className={className} errors={[form.formState.errors?.root]}/>
    }else return null;
}