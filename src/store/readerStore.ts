import { create } from "zustand";

import {
  getDocumentBatchesContent,
  updateLastReadPosition,
} from "../api/documents";
import { BatchDetail } from "../types/api";
import { normalizeError } from "../utils/errors";

interface FetchBatchOptions {
  documentTitle?: string;
  initialBatchOrder?: number;
}

interface ReaderState {
  documentId: string | null;
  documentTitle: string | null;
  pages: BatchDetail[];
  currentIndex: number;
  currentBatchOrder: number;
  isLoading: boolean;
  error: string | null;
  fetchBatches: (documentId: string, options?: FetchBatchOptions) => Promise<void>;
  goNext: () => void;
  goPrevious: () => void;
  goToPage: (index: number) => void;
  persistLastReadPosition: () => void;
  clearReader: () => void;
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;

export const useReaderStore = create<ReaderState>((set, get) => ({
  documentId: null,
  documentTitle: null,
  pages: [],
  currentIndex: 0,
  currentBatchOrder: 0,
  isLoading: false,
  error: null,

  fetchBatches: async (documentId, options) => {
    set({
      isLoading: true,
      error: null,
      documentId,
      documentTitle: options?.documentTitle ?? null,
    });

    try {
      const rawPages = await getDocumentBatchesContent(documentId);
      const pages = rawPages.sort((a, b) => a.batch_order - b.batch_order);

      const initialBatchOrder = options?.initialBatchOrder ?? 0;
      const matchedIndex = pages.findIndex(
        (page) => page.batch_order === initialBatchOrder,
      );
      const resolvedIndex = matchedIndex >= 0 ? matchedIndex : 0;
      const resolvedBatchOrder = pages[resolvedIndex]?.batch_order ?? 0;

      set({
        pages,
        currentIndex: resolvedIndex,
        currentBatchOrder: resolvedBatchOrder,
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

  goNext: () => {
    const state = get();
    if (state.currentIndex >= state.pages.length - 1) {
      return;
    }
    const nextIndex = state.currentIndex + 1;
    const nextOrder = state.pages[nextIndex]?.batch_order ?? state.currentBatchOrder;
    set({
      currentIndex: nextIndex,
      currentBatchOrder: nextOrder,
    });
  },

  goPrevious: () => {
    const state = get();
    if (state.currentIndex <= 0) {
      return;
    }
    const previousIndex = state.currentIndex - 1;
    const previousOrder =
      state.pages[previousIndex]?.batch_order ?? state.currentBatchOrder;
    set({
      currentIndex: previousIndex,
      currentBatchOrder: previousOrder,
    });
  },

  goToPage: (index) => {
    const state = get();
    if (index < 0 || index >= state.pages.length) {
      return;
    }
    const targetOrder = state.pages[index]?.batch_order ?? state.currentBatchOrder;
    set({
      currentIndex: index,
      currentBatchOrder: targetOrder,
    });
  },

  persistLastReadPosition: () => {
    const state = get();
    if (!state.documentId) {
      return;
    }

    if (persistTimer) {
      clearTimeout(persistTimer);
    }

    const documentId = state.documentId;
    const lastReadPosition = state.currentBatchOrder;
    const totalPages = state.pages.length;

    void import("./documentsStore").then(({ useDocumentsStore }) => {
      void useDocumentsStore
        .getState()
        .setLocalProgress({
          documentId,
          lastViewedBatchOrder: lastReadPosition,
          totalPages,
        })
        .catch(() => undefined);
    });

    persistTimer = setTimeout(() => {
      void updateLastReadPosition(documentId, {
        last_read_position: lastReadPosition,
      }).catch(() => {
        // Non-blocking write; avoid interrupting reading flow.
      });
    }, 900);
  },

  clearReader: () => {
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }

    set({
      documentId: null,
      documentTitle: null,
      pages: [],
      currentIndex: 0,
      currentBatchOrder: 0,
      isLoading: false,
      error: null,
    });
  },
}));
