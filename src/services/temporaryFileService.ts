import { apiClient } from "@/lib/apiClient";
import { useState } from "react";

export const useTemporaryFileService = () => {
    const [loading, setLoading] = useState(false);

    const uploadTemporaryFile = async (file: File, purpose?: string): Promise<string> => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (purpose) {
                formData.append('purpose', purpose);
            }

            const response = await apiClient.post('/temporary-files', formData);
            const hash = response.data?.temporaryFile?.hash ?? null;

            if (!hash) {
                throw new Error('No se recibió el hash del archivo');
            }

            return hash;
        } finally {
            setLoading(false);
        }
    };

    const uploadLogo = async (file: File): Promise<string> => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await apiClient.post('/temporary-files/logo', formData);
            const hash = response.data?.temporaryFile?.hash ?? null;
            
            if (!hash) {
                throw new Error('No se recibió el hash del archivo');
            }
            
            return hash;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadTemporaryFile,
        uploadLogo,
        loading
    };
};
