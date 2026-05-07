import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus as ExpoAudioStatus,
} from "expo-audio";
import type { EventSubscription } from "expo-modules-core";
import { create } from "zustand";

import { getVoices, streamAudio, textToAudio } from "../api/audio";
import { Voice } from "../types/api";
import {
  buildAudioCacheKey,
  fileExists,
  getAudioCachePath,
  writeAudioBase64ToFile,
} from "../utils/audio";
import { normalizeError } from "../utils/errors";

type AudioStatus = "idle" | "loading" | "playing" | "paused" | "buffering" | "error";

interface PlayCurrentPageParams {
  documentId: string;
  batchOrder: number;
  text: string;
}

interface AudioState {
  selectedVoice: Voice | null;
  selectedSpeaker: string | null;
  voices: Voice[];
  status: AudioStatus;
  currentAudioUri: string | null;
  duration: number;
  position: number;
  errorMessage: string | null;
  fetchVoices: () => Promise<void>;
  setVoice: (voice: Voice) => void;
  playCurrentPage: (params: PlayCurrentPageParams) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => Promise<void>;
}

let audioPlayer: AudioPlayer | null = null;
let playbackSubscription: EventSubscription | null = null;
let isAudioModeSet = false;

const API_BASE_URL = process.env.EXPO_PUBLIC_SERENDPT_API_BASE_URL ?? "";

const toAbsoluteImageUrl = (imageUrl: string): string => {
  if (!imageUrl) {
    return imageUrl;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (!API_BASE_URL) {
    return imageUrl;
  }

  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const suffix = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${base}${suffix}`;
};

const chooseDefaultVoice = (voices: Voice[]): Voice | null => {
  const available = voices.filter((voice) => !voice.disabled);
  if (!available.length) {
    return null;
  }

  return (
    available.find((voice) => voice.name.toLowerCase() === "charlotte") ??
    available.find((voice) => voice.name.toLowerCase() === "ryan") ??
    available[0]
  );
};

const ensureAudioMode = async (): Promise<void> => {
  if (isAudioModeSet) {
    return;
  }

  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    shouldRouteThroughEarpiece: false,
    allowsRecording: false,
    interruptionMode: "duckOthers",
  });

  isAudioModeSet = true;
};

const disposePlayer = async (): Promise<void> => {
  if (playbackSubscription) {
    playbackSubscription.remove();
    playbackSubscription = null;
  }

  if (!audioPlayer) {
    return;
  }

  try {
    audioPlayer.pause();
  } catch {
    // best effort
  }

  try {
    await audioPlayer.seekTo(0);
  } catch {
    // best effort
  }

  try {
    audioPlayer.remove();
  } catch {
    // best effort
  }

  audioPlayer = null;
};

const mapPlaybackStatus = (playbackStatus: ExpoAudioStatus): AudioStatus => {
  if (playbackStatus.isBuffering) {
    return "buffering";
  }
  if (playbackStatus.playing) {
    return "playing";
  }
  return "paused";
};

export const useAudioStore = create<AudioState>((set, get) => ({
  selectedVoice: null,
  selectedSpeaker: null,
  voices: [],
  status: "idle",
  currentAudioUri: null,
  duration: 0,
  position: 0,
  errorMessage: null,

  fetchVoices: async () => {
    set({ errorMessage: null });
    try {
      const voices = (await getVoices()).map((voice) => ({
        ...voice,
        image_url: toAbsoluteImageUrl(voice.image_url),
      }));
      const fallbackVoice = chooseDefaultVoice(voices);

      set((state) => ({
        voices,
        selectedVoice: state.selectedVoice ?? fallbackVoice,
        selectedSpeaker: state.selectedSpeaker ?? fallbackVoice?.name ?? null,
      }));
    } catch (error) {
      const normalized = normalizeError(error);
      set({ errorMessage: normalized.message });
      throw normalized;
    }
  },

  setVoice: (voice) => {
    if (voice.disabled) {
      return;
    }
    set({
      selectedVoice: voice,
      selectedSpeaker: voice.name,
      errorMessage: null,
    });
  },

  playCurrentPage: async ({ documentId, batchOrder, text }) => {
    const state = get();
    if (!text.trim()) {
      set({
        status: "error",
        errorMessage: "This page has no readable content yet.",
      });
      return;
    }

    const speaker =
      state.selectedSpeaker ??
      chooseDefaultVoice(state.voices)?.name ??
      "Charlotte";

    set({
      status: "loading",
      errorMessage: null,
      position: 0,
    });

    try {
      await ensureAudioMode();
      await disposePlayer();

      const cacheKey = buildAudioCacheKey(documentId, batchOrder, speaker);
      const cachePath = getAudioCachePath(cacheKey);
      let audioUri = cachePath;

      if (!(await fileExists(cachePath))) {
        let audioBase64: string | null = null;

        try {
          const streamResponse = await streamAudio({
            document_id: documentId,
            batch_order: batchOrder,
            language: "English",
            speaker,
          });

          if (streamResponse.audio_base64) {
            audioBase64 = streamResponse.audio_base64;
          }
        } catch {
          audioBase64 = null;
        }

        if (!audioBase64) {
          const fallbackResponse = await textToAudio({
            text,
            language: "English",
            speaker,
          });
          audioBase64 = fallbackResponse.audio_base64;
        }

        if (!audioBase64) {
          throw new Error("Audio generation failed. Please try again.");
        }

        audioUri = await writeAudioBase64ToFile(audioBase64, cachePath);
      }

      audioPlayer = createAudioPlayer(
        {
          uri: audioUri,
        },
        {
          updateInterval: 250,
        },
      );

      playbackSubscription = audioPlayer.addListener(
        "playbackStatusUpdate",
        (playbackStatus) => {
          if (!playbackStatus.isLoaded) {
            return;
          }

          if (playbackStatus.didJustFinish) {
            set({
              status: "idle",
              position: 0,
              duration: Math.floor((playbackStatus.duration ?? 0) * 1000),
            });
            void audioPlayer?.seekTo(0).catch(() => undefined);
            return;
          }

          set({
            status: mapPlaybackStatus(playbackStatus),
            position: Math.floor((playbackStatus.currentTime ?? 0) * 1000),
            duration: Math.floor((playbackStatus.duration ?? 0) * 1000),
          });
        },
      );

      audioPlayer.play();

      set({
        status: "playing",
        currentAudioUri: audioUri,
        errorMessage: null,
      });
    } catch (error) {
      const normalized = normalizeError(error);
      set({
        status: "error",
        errorMessage: normalized.message ?? "Audio generation failed.",
      });
      throw normalized;
    }
  },

  pause: async () => {
    if (!audioPlayer) {
      return;
    }
    audioPlayer.pause();
    set({ status: "paused" });
  },

  resume: async () => {
    if (!audioPlayer) {
      return;
    }
    audioPlayer.play();
    set({ status: "playing" });
  },

  stop: async () => {
    await disposePlayer();
    set({
      status: "idle",
      position: 0,
    });
  },

  reset: async () => {
    await disposePlayer();
    set({
      selectedVoice: null,
      selectedSpeaker: null,
      voices: [],
      status: "idle",
      currentAudioUri: null,
      duration: 0,
      position: 0,
      errorMessage: null,
    });
  },
}));
