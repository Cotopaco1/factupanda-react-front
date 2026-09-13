import type { LaravelErrors, LaravelValidationError } from "@/types/errors";
import type { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

const MAX_TOASTED_MESSAGES = 3;

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

/**
 * Not every field has a rendered <FieldError/>: errors on `products.*` or on the
 * form root used to be applied to the form and never shown, so the user pressed
 * "Generar cotización" and nothing happened at all. Surfacing them as a toast
 * guarantees feedback regardless of which field failed.
 */
const NotifyServerErrors = (backendErrors : LaravelErrors) : void => {
    const messages = Object.values(backendErrors).flat();

    if (messages.length === 0) return;

    const shown = messages.slice(0, MAX_TOASTED_MESSAGES);
    const remaining = messages.length - shown.length;

    toast.error('Revisa los datos del formulario', {
        description: remaining > 0
            ? `${shown.join(' ')} (y ${remaining} error(es) más)`
            : shown.join(' '),
    });
}

export const MergeServerErrorsToForm = async (error : AxiosError, form : UseFormReturn<any>) : Promise<void> => {
    let errorData = error.response?.data as Partial<LaravelValidationError> | Blob | undefined;

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

    if(errorData && 'message' in errorData && errorData.message) {
        form.setError('root', {
            type : 'server',
            message : errorData.message
        })
    }

    const status = error.response?.status;
    if(!isValidationError(status)) return;

    const errors : LaravelErrors = (errorData && 'errors' in errorData ? errorData.errors : undefined) ?? {};
    ApplyServerErrorsToRHF(errors, form);
    NotifyServerErrors(errors);
}
