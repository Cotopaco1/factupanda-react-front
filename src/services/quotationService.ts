import { apiClient } from "@/lib/apiClient";
import { useState } from "react";
/* TODO: Utilizar el UseApiClient(). */
export const useQuotationService = () => {

    const [loading, setLoading] = useState(false);

    const createQuotation = async (data: any) : Promise<Blob> => {
        setLoading(true);
        try {
            const response = await apiClient.post('/quotations', data, { responseType : 'blob'});
            return response.data;
        } catch (error: any) {
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    error.response.data = JSON.parse(text);
                } catch (parseError) {
                    console.error("Failed to parse error response:", parseError);
                    error.response.data = {
                        message: "Error al procesar la respuesta del servidor"
                    };
                }
            }
            throw error;
        } finally {
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