import { apiGet, apiPost } from "./client";
import {
  AudioStreamRequest,
  TextToAudioRequest,
  TextToAudioResponse,
  Voice,
  VoicesResponse,
} from "../types/api";

const normalizeVoices = (payload: VoicesResponse | Voice[]): Voice[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.voices ?? [];
};

export const getVoices = async (): Promise<Voice[]> => {
  const response = await apiGet<VoicesResponse | Voice[]>("/audio/voices");
  return normalizeVoices(response);
};

export const streamAudio = (payload: AudioStreamRequest) =>
  apiPost<TextToAudioResponse, AudioStreamRequest>("/audio/stream", payload);

export const textToAudio = (payload: TextToAudioRequest) =>
  apiPost<TextToAudioResponse, TextToAudioRequest>("/audio/text", payload);
