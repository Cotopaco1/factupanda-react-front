import { apiClient } from "@/lib/apiClient";
import type { LaravelPaginator } from "@/types/paginator";
import type { Product } from "@/types/products";
import type { ApiResponse } from "@/types/responses";
import { useState } from "react"

export const useProductService = () => {

    const [loading, setLoading] = useState(false);

    // Manage loading state
    const handleFetch = async <T>(cb: () => Promise<T>): Promise<T> => {
        setLoading(true);
        try {
            const result = await cb();
            return result;
        }
        finally {
            setLoading(false);
        }
    }

    const create = (data) => {
        return handleFetch(async () => {
            const response = await apiClient.post<ApiResponse<{ product: Product }>>('/products', data)
            return response.data;
        });

    }

    type ProductsListFilters = {
        per_page?: number;
        page?: number;
        name?: string;
    }

    /**  Retreive products with pagination */
    const list = (url : string|null = null, filters: ProductsListFilters = {}) => {
        const finalUrl = url ? url : '/products';
        return handleFetch(async () => {
            const response = await apiClient.get<
            ApiResponse<LaravelPaginator<Product>>
            >(finalUrl, { params: filters })
            return response.data
        });
    }

    /** Retreive products based on query string */
    const searchProducts = (query : string) => {

        return handleFetch(async () => {
            const response = await apiClient.get<
            ApiResponse<{data : Product[]}>
            >("/search/products", { params: {query : query} })
            return response.data
        });
    }
    

    return { create, loading, list, searchProducts }
}