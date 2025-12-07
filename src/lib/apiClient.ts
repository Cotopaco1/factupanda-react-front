import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials : true,
  headers : {
    "Accept-Language" : 'es'
  }
});
apiClient.defaults.xsrfCookieName = "XSRF-TOKEN";
apiClient.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

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

apiClient.interceptors.response.use((config) => config, csrfToken);
