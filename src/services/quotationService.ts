import { apiClient } from "@/lib/apiClient";
import type { LaravelPaginator } from "@/types/paginator";
import type { QuotationDetail, QuotationListItem, QuotationUpdatePayload } from "@/types/quotation";
import type { ApiResponse } from "@/types/responses";
import { useState } from "react";

export type QuotationsListFilters = {
    per_page?: number;
    page?: number;
}

export const useQuotationService = () => {

    const [loading, setLoading] = useState(false);

    const handleFetch = async <T>(cb: () => Promise<T>): Promise<T> => {
        setLoading(true);
        try {
            return await cb();
        } finally {
            setLoading(false);
        }
    }

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

    const list = (filters: QuotationsListFilters = {}) => {
        return handleFetch(async () => {
            const response = await apiClient.get<ApiResponse<LaravelPaginator<QuotationListItem>>>('/quotations', { params: filters });
            return response.data;
        });
    }

    const getById = (id: number) => {
        return handleFetch(async () => {
            const response = await apiClient.get<ApiResponse<QuotationDetail>>(`/quotations/${id}`);
            return response.data;
        });
    }

    const update = (id: number, data: QuotationUpdatePayload) => {
        return handleFetch(async () => {
            const response = await apiClient.put<ApiResponse<{ quotation: QuotationListItem }>>(`/quotations/${id}`, data);
            return response.data;
        });
    }

    const deleteById = (id: number) => {
        return handleFetch(async () => {
            const response = await apiClient.delete(`/quotations/${id}`);
            return response.data;
        });
    }

    return {
        createQuotation,
        getDueDates,
        list,
        getById,
        update,
        deleteById,
        loading
    }
}