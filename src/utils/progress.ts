import AsyncStorage from "@react-native-async-storage/async-storage";

import { clampPercent } from "./format";

const LOCAL_PROGRESS_KEY = "serendpt_local_document_progress_v1";

export interface LocalDocumentProgress {
  lastViewedBatchOrder: number;
  totalPages: number;
  updatedAt: number;
}

export type LocalProgressMap = Record<string, LocalDocumentProgress>;

export interface DocumentProgressMetrics {
  totalPages: number;
  viewedPages: number;
  progressPercent: number;
}

const isValidProgressEntry = (value: unknown): value is LocalDocumentProgress => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<LocalDocumentProgress>;
  return (
    typeof candidate.lastViewedBatchOrder === "number" &&
    typeof candidate.totalPages === "number" &&
    typeof candidate.updatedAt === "number"
  );
};

export const loadLocalProgressMap = async (): Promise<LocalProgressMap> => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return Object.entries(parsed).reduce<LocalProgressMap>((acc, [key, value]) => {
      if (isValidProgressEntry(value)) {
        acc[key] = value;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
};

export const saveLocalProgressMap = async (map: LocalProgressMap): Promise<void> => {
  try {
    await AsyncStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // Non-blocking cache write.
  }
};

export const mergeLastReadPosition = (
  backendPosition?: number | null,
  localEntry?: LocalDocumentProgress,
): number | null => {
  const backendValue = typeof backendPosition === "number" ? backendPosition : null;
  const localValue =
    typeof localEntry?.lastViewedBatchOrder === "number"
      ? localEntry.lastViewedBatchOrder
      : null;

  if (backendValue === null && localValue === null) {
    return null;
  }

  if (backendValue === null) {
    return localValue;
  }

  if (localValue === null) {
    return backendValue;
  }

  return Math.max(backendValue, localValue);
};

export const computeDocumentProgress = (
  lastReadPositionZeroBased: number | null | undefined,
  totalPages: number | null | undefined,
): DocumentProgressMetrics => {
  const safeTotalPages = Math.max(0, totalPages ?? 0);

  if (!safeTotalPages) {
    return {
      totalPages: 0,
      viewedPages: 0,
      progressPercent: 0,
    };
  }

  const currentBatchOrder = Math.max(0, lastReadPositionZeroBased ?? 0);
  const viewedPages = Math.min(currentBatchOrder + 1, safeTotalPages);
  const progressPercent = clampPercent((viewedPages / safeTotalPages) * 100);

  return {
    totalPages: safeTotalPages,
    viewedPages,
    progressPercent,
  };
};

export const updateLocalProgressEntry = (
  map: LocalProgressMap,
  documentId: string,
  patch: Partial<LocalDocumentProgress>,
): LocalProgressMap => {
  const previous = map[documentId];
  const next: LocalDocumentProgress = {
    lastViewedBatchOrder:
      patch.lastViewedBatchOrder ??
      previous?.lastViewedBatchOrder ??
      0,
    totalPages: patch.totalPages ?? previous?.totalPages ?? 0,
    updatedAt: patch.updatedAt ?? Date.now(),
  };

  return {
    ...map,
    [documentId]: next,
  };
};
