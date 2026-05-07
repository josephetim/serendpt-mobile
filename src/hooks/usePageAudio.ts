import { useCallback, useEffect, useRef } from "react";

import { useAudioStore } from "../store/audioStore";

interface UsePageAudioParams {
  documentId: string;
  batchOrder: number;
  text: string;
}

export const usePageAudio = ({ documentId, batchOrder, text }: UsePageAudioParams) => {
  const status = useAudioStore((state) => state.status);
  const errorMessage = useAudioStore((state) => state.errorMessage);
  const playCurrentPage = useAudioStore((state) => state.playCurrentPage);
  const pause = useAudioStore((state) => state.pause);
  const resume = useAudioStore((state) => state.resume);
  const stop = useAudioStore((state) => state.stop);

  const lastKeyRef = useRef<string | null>(null);
  const key = `${documentId}:${batchOrder}`;

  useEffect(() => {
    if (lastKeyRef.current && lastKeyRef.current !== key) {
      void stop();
    }
    lastKeyRef.current = key;
  }, [key, stop]);

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  const togglePlayPause = useCallback(async () => {
    if (status === "loading" || status === "buffering") {
      return;
    }
    if (status === "playing") {
      await pause();
      return;
    }
    if (status === "paused") {
      await resume();
      return;
    }

    await playCurrentPage({
      documentId,
      batchOrder,
      text,
    });
  }, [
    status,
    pause,
    resume,
    playCurrentPage,
    documentId,
    batchOrder,
    text,
  ]);

  const startPlayback = useCallback(async () => {
    if (status === "loading" || status === "buffering" || status === "playing") {
      return;
    }

    if (status === "paused") {
      await resume();
      return;
    }

    await playCurrentPage({
      documentId,
      batchOrder,
      text,
    });
  }, [status, resume, playCurrentPage, documentId, batchOrder, text]);

  return {
    status,
    errorMessage,
    togglePlayPause,
    startPlayback,
    stop,
  };
};
