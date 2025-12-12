import { apiClient } from "@/lib/apiClient";
import { useState } from "react";
/* TODO: Utilizar el UseApiClient(). */
export const useQuotationService = () => {

    const [loading, setLoading] = useState(false);

    const createQuotation = async (data: any) : Promise<Blob> => {
        setLoading(true);
        try {
            const response = await apiClient.post('/quotations', data, { responseType : 'blob'});
            console.log(response);
            return response.data;
        } catch (error: any) {
            // Agregar los errores del backend al objeto error para React Hook Form
            if (error.response?.data?.errors) {
                console.log("Errores desde QuotationService : ",error.response.data.errors);
                error.backendErrors = error.response.data.errors;
            }
            throw error;
        }finally {
            setLoading(false);
        }
    }

    const getDueDates = () => {
        setLoading(true);
        return apiClient.get('/due_dates')
        .then((response) => {
            return response.data?.due_dates ?? null;
        }).finally(()=> setLoading(false))
    }

    return {
        createQuotation,
        getDueDates,
        loading
    }
}