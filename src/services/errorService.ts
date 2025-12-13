import type { LaravelErrors } from "@/types/errors";
import type { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";

const isValidationError = (status?: number) => {
    return status === 422;
}

const ApplyServerErrorsToRHF = (backendErrors : LaravelErrors, form : UseFormReturn<any>) : void => {
    Object.entries(backendErrors).forEach(([field, messages]) => {
        const message = messages.join('\n')

        form.setError(field as any, {
            type: 'server',
            message,
        })
    })
}

export const MergeServerErrorsToForm = async (error : AxiosError, form : UseFormReturn<any>) : Promise<void> => {
    let errorData = error.response?.data;

    if (errorData instanceof Blob) {
        try {
            const text = await errorData.text();
            errorData = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse Blob error in errorService:", parseError);
            errorData = {
                message: "Error al procesar la respuesta del servidor"
            };
        }
    }

    if(errorData?.message) {
        form.setError('root', {
            type : 'server',
            message : errorData.message
        })
    }
    
    const status = error.response?.status;
    if(!isValidationError(status)) return;
    
    const errors : LaravelErrors = errorData?.errors ?? {};
    ApplyServerErrorsToRHF(errors, form);
}