import type { LaravelErrors } from "@/types/errors";
import type { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";

const isValidationError = (response : AxiosError) => {
    const status = response.status || 500;
    return status == 422;
}

const ApplyServerErrorsToRHF = (backendErrors : LaravelErrors, form : UseFormReturn<any>) : void => {
    
    Object.entries(backendErrors).forEach(([field, messages]) => {
        // Laravel manda array de strings: usamos la primera o las unimos
        const message = messages.join('\n')

        form.setError(field as any, {
            type: 'server',
            message,
        })
    })

}

export const MergeServerErrorsToForm = (error : AxiosError, form : UseFormReturn) : void => {
    
    if(!error.isAxiosError || !isValidationError(error)) return;
    const errors : LaravelErrors = error.response?.data?.error ?? {};

    ApplyServerErrorsToRHF({...errors, message : error.response?.data?.message ?? ''  }, form);
}