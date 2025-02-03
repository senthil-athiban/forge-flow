import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { BACKEND_URL } from "@/app/config";
import AuthService from "@/services/auth.service";
import { logout } from "@/utils/auth";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import { ErrorResponse } from "./error";

let retryCount = 0;
const MAX_RETRIES = 3;

class HttpClient {
  private static instance: HttpClient;
  private static client: AxiosInstance;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = BACKEND_URL || "";
  }

  public static getInstance(): HttpClient {
    if (!this.instance) {
      this.instance = new HttpClient();
    }
    return this.instance;
  }

  public static getClient(): AxiosInstance {
    if (!this.client) {
      this.client = this.getInstance().initClient();
    }
    return this.client;
  }

  private formatErrorMessage = (error: any): ErrorResponse => {
    // Network Errors
    if (!error.response || error.message === 'Network Error') {
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        status: 0,
        code: 'NETWORK_ERROR'
      };
    }
  
    const { status, data } = error.response;
  
    // Auth Errors (401, 403)
    if (status === 401) {
      return {
        message: data?.message ?? 'Your session has expired. Please login again.',
        status,
        code: 'UNAUTHORIZED'
      };
    }
  
    if (status === 403) {
      return {
        message: 'You do not have permission to perform this action.',
        status,
        code: 'FORBIDDEN'
      };
    }
  
    // Validation Errors (400, 422)
    if (status === 400 || status === 422) {
      return {
        message: error.response.data?.message || 'Invalid input. Please check your data.',
        status,
        code: 'VALIDATION_ERROR'
      };
    }
  
    // Server Errors (500+)
    if (status >= 500) {
      return {
        message: 'An unexpected error occurred. Please try again later.',
        status,
        code: 'SERVER_ERROR'
      };
    }
  
    // Default Error
    return {
      message: error.response.data?.message || 'Something went wrong.',
      status: status || 500,
      code: 'UNKNOWN_ERROR'
    };
  };

  private initClient(): AxiosInstance {
    const http = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 1000,
    });

    http.interceptors.request.use(
      (config) => {
        try {
          const accessToken = getFromLocalStorage(STORAGE_KEYS.ACCESS_TOKEN);
          if (accessToken) {
            config.headers.Authorization = accessToken;
          }
        } catch (error) {
          console.error("Error in request interceptor : ", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    http.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const formattedError = this.formatErrorMessage(error);
        
        const prevRequest = error?.config as AxiosRequestConfig & {
          sent?: boolean;
        };
        
        //@ts-ignore
        if (error.response?.status === 401 && !prevRequest.sent && !error.response.data.message.includes("Invalid credentials")) {
          prevRequest.sent = true;
          try {
            const response = await AuthService.getRefreshToken();
            saveToLocalStorage(STORAGE_KEYS.ACCESS_TOKEN,response?.message?.accesstoken ?? "")
            if (prevRequest.headers) {
              prevRequest.headers.Authorization = response?.accesstoken;
            }
            return http(prevRequest);
          } catch (error) {
            logout();
          }
        }

        // Handle auth errors
        if (formattedError.status === 401 || formattedError.status === 403) {
          // logout();
          return Promise.reject(formattedError);
        }
        if (
          (error.response && error.response.status >= 500) ||
          error.message.includes("Network error")
        ) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying for ${retryCount} time`);
            await new Promise((r) => setTimeout(r, 1000));
            http(prevRequest);
          }
        }
        retryCount = 0;
        return Promise.reject(error);
      }
    );

    return http;
  }

  static get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.getClient().get(url, config);
  }
  static delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.getClient().delete(url, config);
  }
  static post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.getClient().post(url, data, config);
  }
  static put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.getClient().put(url, data, config);
  }
  static patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.getClient().put(url, data, config);
  }
}
export default HttpClient;
