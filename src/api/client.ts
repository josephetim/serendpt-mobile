import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { clearAuthSession } from "../utils/storage";
import { AppError, normalizeError } from "../utils/errors";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERENDPT_API_BASE_URL;

let authToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

api.interceptors.request.use((config) => {
  if (!API_BASE_URL) {
    throw new AppError(
      "Missing API URL. Add EXPO_PUBLIC_SERENDPT_API_BASE_URL to your environment.",
    );
  }

  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      await clearAuthSession();
      void import("../store/authStore").then(({ useAuthStore }) => {
        useAuthStore.getState().handleUnauthorized();
      });
    }
    return Promise.reject(normalizeError(error));
  },
);

export const apiGet = async <T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.get<T>(path, config);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const apiPost = async <T, B = unknown>(
  path: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.post<T>(path, body, config);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const apiPut = async <T, B = unknown>(
  path: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.put<T>(path, body, config);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const isNetworkError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }
  return !error.response;
};
