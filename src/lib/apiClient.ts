import axios, { AxiosError } from "axios";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipGlobalError?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials : true, // Estamos usando stateless
  headers : {
    "Accept-Language" : 'es',
  }
});

// apiClient.defaults.xsrfCookieName = "XSRF-TOKEN"; // Estamos usando stateless
// apiClient.defaults.xsrfHeaderName = "X-XSRF-TOKEN"; // Estamos usando stateless

const csrfToken = async (error: AxiosError) => {
    const { response, config } = error;

    // Si no hay response o no hay config original, lanza el error normal
    if (!response || !config) {
      return Promise.reject(error);
    }

    // Evitar loop infinito
    // @ts-expect-error propiedad interna
    if (response.status === 419 && !config._retry) {
      // @ts-expect-error marca interna
      config._retry = true;

      try {
        // 1. Pide nuevo CSRF cookie a Sanctum
        await apiClient.get("/csrf-cookie");

        // 2. Reintenta la petición original con el nuevo token
        return apiClient(config);
      } catch (csrfError) {
        // Si incluso al regenerar CSRF falla, lanza el error
        return Promise.reject(csrfError);
      }
    }

    return Promise.reject(error);
  }

// apiClient.interceptors.response.use((config) => config, csrfToken); // Estamos en stateless

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tkn');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const skipError = error.config?.skipGlobalError;
    
    if (skipError) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    let errorData = error.response?.data;

    if (errorData instanceof Blob) {
      try {
        const text = await errorData.text();
        errorData = JSON.parse(text);
      } catch {
        errorData = null;
      }
    }

    const message = errorData?.message || 'Error Descnocido, intente nuevamente';

    if (!status) {
      toast.error('Error de red: No se pudo conectar al servidor');
    } else if (status !== 422) {
      toast.error(`Error ${status}: ${message}`);
    }

    return Promise.reject(error);
  }
);
