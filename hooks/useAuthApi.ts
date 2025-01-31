import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import Constants from "expo-constants";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

const useAuthApi = <T = any>(
  endpoint: string,
  method: AxiosRequestConfig["method"] = "POST",
  options?: UseApiOptions<T>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const callApi = async (payload?: any, config?: AxiosRequestConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.request<T>({
        url: endpoint,
        method,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
        ...config,
      });

      setData(response.data);
      if (options?.onSuccess) options.onSuccess(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
      if (options?.onError) options.onError(err);
      console.error("Auth API Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, callApi };
};

export default useAuthApi;
