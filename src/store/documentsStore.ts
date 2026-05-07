import { create } from "zustand";

import {
  getDocumentBatchesContent,
  getDocumentsByEmail,
  processDocument,
  UploadDocumentPayload,
} from "../api/documents";
import { DocumentSummary } from "../types/api";
import { normalizeError } from "../utils/errors";
import {
  loadLocalProgressMap,
  LocalProgressMap,
  saveLocalProgressMap,
  updateLocalProgressEntry,
} from "../utils/progress";

interface DocumentsState {
  documents: DocumentSummary[];
  isLoading: boolean;
  error: string | null;
  totalPagesByDocumentId: Record<string, number>;
  loadingTotalPagesByDocumentId: Record<string, boolean>;
  localProgressByDocumentId: LocalProgressMap;
  isProgressHydrated: boolean;
  hydrateLocalProgress: () => Promise<void>;
  fetchDocuments: () => Promise<void>;
  fetchDocumentTotalPages: (documentId: string, force?: boolean) => Promise<number>;
  uploadDocument: (payload: UploadDocumentPayload) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  setLocalProgress: (params: {
    documentId: string;
    lastViewedBatchOrder: number;
    totalPages?: number;
  }) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,
  totalPagesByDocumentId: {},
  loadingTotalPagesByDocumentId: {},
  localProgressByDocumentId: {},
  isProgressHydrated: false,

  hydrateLocalProgress: async () => {
    if (get().isProgressHydrated) {
      return;
    }

    const localProgressByDocumentId = await loadLocalProgressMap();
    const totalPagesByDocumentId = Object.entries(localProgressByDocumentId).reduce<
      Record<string, number>
    >((acc, [documentId, entry]) => {
      if (entry.totalPages > 0) {
        acc[documentId] = entry.totalPages;
      }
      return acc;
    }, {});

    set({
      localProgressByDocumentId,
      totalPagesByDocumentId: {
        ...get().totalPagesByDocumentId,
        ...totalPagesByDocumentId,
      },
      isProgressHydrated: true,
    });
  },

  fetchDocuments: async () => {
    await get().hydrateLocalProgress();
    set({ isLoading: true, error: null });
    try {
      const documents = await getDocumentsByEmail();
      set({
        documents,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const normalized = normalizeError(error);
      set({
        isLoading: false,
        error: normalized.message,
      });
      throw normalized;
    }
  },

  fetchDocumentTotalPages: async (documentId, force = false) => {
    const state = get();
    const cachedTotalPages = state.totalPagesByDocumentId[documentId];
    if (!force && typeof cachedTotalPages === "number" && cachedTotalPages > 0) {
      return cachedTotalPages;
    }

    if (state.loadingTotalPagesByDocumentId[documentId]) {
      return cachedTotalPages ?? 0;
    }

    set((prev) => ({
      loadingTotalPagesByDocumentId: {
        ...prev.loadingTotalPagesByDocumentId,
        [documentId]: true,
      },
    }));

    try {
      const batches = await getDocumentBatchesContent(documentId);
      const totalPages = Math.max(0, batches.length);

      set((prev) => ({
        totalPagesByDocumentId: {
          ...prev.totalPagesByDocumentId,
          [documentId]: totalPages,
        },
      }));

      const nextLocalProgress = updateLocalProgressEntry(
        get().localProgressByDocumentId,
        documentId,
        {
          totalPages,
        },
      );
      set({ localProgressByDocumentId: nextLocalProgress });
      await saveLocalProgressMap(nextLocalProgress);

      return totalPages;
    } catch (error) {
      return cachedTotalPages ?? 0;
    } finally {
      set((prev) => ({
        loadingTotalPagesByDocumentId: {
          ...prev.loadingTotalPagesByDocumentId,
          [documentId]: false,
        },
      }));
    }
  },

  uploadDocument: async (payload) => {
    set({ error: null });
    try {
      await processDocument(payload);
      await get().fetchDocuments();
    } catch (error) {
      const normalized = normalizeError(error);
      set({ error: normalized.message });
      throw normalized;
    }
  },

  refreshDocuments: async () => {
    await get().fetchDocuments();
  },

  setLocalProgress: async ({ documentId, lastViewedBatchOrder, totalPages }) => {
    await get().hydrateLocalProgress();

    const nextLocalProgress = updateLocalProgressEntry(
      get().localProgressByDocumentId,
      documentId,
      {
        lastViewedBatchOrder,
        totalPages,
      },
    );

    set((prev) => ({
      localProgressByDocumentId: nextLocalProgress,
      totalPagesByDocumentId:
        typeof totalPages === "number" && totalPages > 0
          ? {
              ...prev.totalPagesByDocumentId,
              [documentId]: totalPages,
            }
          : prev.totalPagesByDocumentId,
    }));

    await saveLocalProgressMap(nextLocalProgress);
  },
}));
