import { useEffect } from "react";

import { useReaderStore } from "../store/readerStore";

export const useReader = () => {
  const store = useReaderStore();

  useEffect(() => {
    if (!store.documentId || !store.pages.length) {
      return;
    }
    store.persistLastReadPosition();
  }, [store.currentBatchOrder, store.documentId, store.pages.length, store.persistLastReadPosition]);

  return store;
};
