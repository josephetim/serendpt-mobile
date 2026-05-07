import { UserDetailResponse } from "../types/api";

export const formatApiDate = (isoDate: string): string => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const safeProgressPercent = (
  currentPositionZeroBased?: number | null,
  totalPages?: number | null,
): number => {
  if (!totalPages || totalPages <= 0) {
    return 0;
  }

  const normalizedPosition = Math.max(0, currentPositionZeroBased ?? 0);
  const viewedPages = Math.min(normalizedPosition + 1, totalPages);
  const raw = (viewedPages / totalPages) * 100;
  return Math.round(Math.min(100, Math.max(0, raw)));
};

export const clampPercent = (value: number): number => {
  return Math.max(0, Math.min(100, Math.round(value)));
};

export const getFriendlyFileType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "PDF";
    case "doc":
      return "DOC";
    case "docx":
      return "DOCX";
    case "txt":
      return "TXT";
    default:
      return "DOC";
  }
};

export const truncateText = (value: string, maxLength = 60): string => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
};

export const getUserInitial = (user?: UserDetailResponse | null): string => {
  const name = user?.full_name?.trim();
  if (name) {
    return name.charAt(0).toUpperCase();
  }

  const email = user?.email?.trim();
  if (email) {
    return email.charAt(0).toUpperCase();
  }

  return "?";
};
