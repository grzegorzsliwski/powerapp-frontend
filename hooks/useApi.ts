import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

const refreshToken = async () => {
  try {
    const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!storedRefreshToken) return null;

    const response = await axios.post(
      `${Constants.expoConfig?.extra?.BASE_URL}token`,
      {
        token: storedRefreshToken,
      }
    );

    if (response.status === 200) {
      const { accessToken } = response.data;
      await SecureStore.setItemAsync("accessToken", accessToken);
      return accessToken;
    } else {
      console.log("Refresh token failed. Logging out.");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

const useApi = <T = any>(
  endpoint: string,
  method: AxiosRequestConfig["method"] = "GET",
  options?: UseApiOptions<T>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const callApi = async (payload?: any, config?: AxiosRequestConfig) => {
    setIsLoading(true);
    setError(null);

    let accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      const response = await axios.request<T>({
        url: endpoint,
        method,
        data: payload,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Content-Type": "application/json",
        },
        ...config,
      });

      setData(response.data);
      if (options?.onSuccess) options.onSuccess(response.data);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Access token expired. Refreshing token...");
        accessToken = await refreshToken();

        if (accessToken) {
          return callApi(payload, config);
        }
      }

      setError(err.response?.data?.message || "An unexpected error occurred.");
      if (options?.onError) options.onError(err);
      console.error("API Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, callApi };
};

export default useApi;
