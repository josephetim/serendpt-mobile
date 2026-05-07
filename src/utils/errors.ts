import axios, { AxiosError } from "axios";

export class AppError extends Error {
  statusCode?: number;
  details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const message =
      data?.detail ??
      data?.message ??
      axiosError.message ??
      "Something went wrong. Please try again.";

    return new AppError(message, status, data);
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError("Something went wrong. Please try again.");
};
