import { apiClient } from "@/lib/apiClient";
import type { Currency } from "@/types/currency";
import type { ApiResponse } from "@/types/responses";
import { useState } from "react";

type CurrenciesResponse = {
    currencies: Currency[];
}

export const useCurrencyService = () => {
    const [loading, setLoading] = useState(false);

    const list = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<ApiResponse<CurrenciesResponse>>('/currencies');
            return response.data;
        } finally {
            setLoading(false);
        }
    }

    return {
        list,
        loading,
    }
}
