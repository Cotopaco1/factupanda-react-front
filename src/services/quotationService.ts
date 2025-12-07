import { apiClient } from "@/lib/apiClient";

export const useQuotationService = () => {

    const createQuotation = async (data: any) : Promise<Blob> => {
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
        }
    }

    const getDueDates = () => {
        return apiClient.get('/due_dates')
        .then((response) => {
            return response.data?.due_dates ?? null;
        }) 
    }

    return {
        createQuotation,
        getDueDates
    }
}