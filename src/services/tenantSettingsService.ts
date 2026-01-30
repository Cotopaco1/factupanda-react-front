import { apiClient } from "@/lib/apiClient";
import type { TenantSettings, TenantSettingsUpdatePayload } from "@/types/tenantSettings";
import type { ApiResponse } from "@/types/responses";
import { useState } from "react";

export const useTenantSettingsService = () => {
    const [loading, setLoading] = useState(false);

    const handleFetch = async <T>(cb: () => Promise<T>): Promise<T> => {
        setLoading(true);
        try {
            return await cb();
        } finally {
            setLoading(false);
        }
    }

    const get = () => {
        return handleFetch(async () => {
            const response = await apiClient.get<ApiResponse<{ settings: TenantSettings }>>('/tenant/settings');
            return response.data;
        });
    }

    const update = (data: TenantSettingsUpdatePayload) => {
        return handleFetch(async () => {
            const response = await apiClient.put<ApiResponse<{ settings: TenantSettings }>>('/tenant/settings', data);
            return response.data;
        });
    }

    return {
        get,
        update,
        loading
    }
}
