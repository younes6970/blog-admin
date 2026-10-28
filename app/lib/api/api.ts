import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { AxiosInstance } from "axios";
import type { Error, ErrorResponse } from "~/types";
import axiosInstance from "./axiosInstance";

function handleError(error: unknown): never {
  const data = isAxiosError<ErrorResponse>(error) ? error.response?.data : undefined;
  const detail: Error = data?.error ?? {
    code: "REQUEST_FAILED",
    message: "خطایی در ارتباط با سرور رخ داده است",
  };
  toast.error(detail.message, { id: detail.code, duration: 5000 });
  // Preserve the Axios error so query retry rules can inspect HTTP status.
  throw error;
}

export const apiPost = async <TRequest = null, TResponse = Response>(
  endpoint: string,
  params?: TRequest
) => {
  try {
    const { data } = await axiosInstance.post(endpoint, params);
    return data as TResponse;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const apiGet = async <TResponse = Response>(
  endpoint: string,
  params?: Record<string, unknown>,
  client: AxiosInstance = axiosInstance,
): Promise<TResponse> => {
  try {
    const filteredParams =
      params &&
      Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      );
    const { data } = await client.get(endpoint, {
      params: filteredParams,
    });
    return data as TResponse;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const apiGetBlob = async (
  endpoint: string,
  params?: Record<string, unknown>,
  client: AxiosInstance = axiosInstance,
): Promise<Blob> => {
  try {
    const filteredParams =
      params &&
      Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== "",
        ),
      );
    const { data } = await client.get<Blob>(endpoint, {
      params: filteredParams,
      responseType: "blob",
    });
    return data;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const apiPut = async <TRequest = null, TResponse = Response>(
  endpoint: string,
  params?: TRequest
) => {
  try {
    const { data } = await axiosInstance.put(endpoint, params);
    return data as TResponse;
  } catch (error: unknown) {
    handleError(error);
  }
};

export const apiDelete = async <TResponse = Response>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<TResponse> => {
  try {
    const { data } = await axiosInstance.delete(endpoint, { params });
    return data as TResponse;
  } catch (error: unknown) {
    handleError(error);
  }
};
