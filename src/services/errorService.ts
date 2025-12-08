import type { LaravelErrors } from "@/types/errors";
import type { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";

const isValidationError = (response : AxiosError) => {
    const status = response.status || 500;
    return status == 422;
}

const ApplyServerErrorsToRHF = (backendErrors : LaravelErrors, form : UseFormReturn<any>) : void => {
    console.log("Backend Errors:" , backendErrors)
    Object.entries(backendErrors).forEach(([field, messages]) => {
        console.log("Dentro de Object Entierers: ", field, messages);
        // Laravel manda array de strings: usamos la primera o las unimos
        const message = messages.join('\n')

        form.setError(field as any, {
            type: 'server',
            message,
        })
    })

}
/* TODO: Crear un custom hook parap oder utilziar esta funcion y recibir el MEssage general. */
export const MergeServerErrorsToForm = (error : AxiosError, form : UseFormReturn<any>) : void => {

    if(error.response?.data?.message){ // Add standard error message
        console.log("Agregando error root...")
        form.setError('root', {
            type : 'server',
            message : error.response?.data?.message
        })
    }
    
    if(!error.isAxiosError || !isValidationError(error)) return;
    const errors : LaravelErrors = error.response?.data?.error ?? {};

    ApplyServerErrorsToRHF({...errors }, form);
}