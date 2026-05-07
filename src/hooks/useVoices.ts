import { useEffect } from "react";

import { useAudioStore } from "../store/audioStore";

export const useVoices = () => {
  const voices = useAudioStore((state) => state.voices);
  const selectedVoice = useAudioStore((state) => state.selectedVoice);
  const fetchVoices = useAudioStore((state) => state.fetchVoices);
  const setVoice = useAudioStore((state) => state.setVoice);
  const errorMessage = useAudioStore((state) => state.errorMessage);

  useEffect(() => {
    if (voices.length) {
      return;
    }
    void fetchVoices().catch(() => undefined);
  }, [voices.length, fetchVoices]);

  return {
    voices,
    selectedVoice,
    setVoice,
    fetchVoices,
    errorMessage,
  };
};
