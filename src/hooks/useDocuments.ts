import { useCallback } from "react";

import { useDocumentsStore } from "../store/documentsStore";

export const useDocuments = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const isLoading = useDocumentsStore((state) => state.isLoading);
  const error = useDocumentsStore((state) => state.error);
  const totalPagesByDocumentId = useDocumentsStore(
    (state) => state.totalPagesByDocumentId,
  );
  const loadingTotalPagesByDocumentId = useDocumentsStore(
    (state) => state.loadingTotalPagesByDocumentId,
  );
  const localProgressByDocumentId = useDocumentsStore(
    (state) => state.localProgressByDocumentId,
  );
  const hydrateLocalProgress = useDocumentsStore(
    (state) => state.hydrateLocalProgress,
  );
  const fetchDocuments = useDocumentsStore((state) => state.fetchDocuments);
  const fetchDocumentTotalPages = useDocumentsStore(
    (state) => state.fetchDocumentTotalPages,
  );
  const uploadDocument = useDocumentsStore((state) => state.uploadDocument);
  const refreshDocuments = useDocumentsStore((state) => state.refreshDocuments);
  const setLocalProgress = useDocumentsStore((state) => state.setLocalProgress);

  const clearError = useCallback(() => {
    useDocumentsStore.setState({ error: null });
  }, []);

  return {
    documents,
    isLoading,
    error,
    totalPagesByDocumentId,
    loadingTotalPagesByDocumentId,
    localProgressByDocumentId,
    hydrateLocalProgress,
    fetchDocuments,
    fetchDocumentTotalPages,
    uploadDocument,
    refreshDocuments,
    setLocalProgress,
    clearError,
  };
};
