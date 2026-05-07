import * as FileSystem from "expo-file-system/legacy";

const AUDIO_CACHE_DIR = `${FileSystem.cacheDirectory}serendpt-audio/`;

const sanitize = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, "_");

export const buildAudioCacheKey = (
  documentId: string,
  batchOrder: number,
  speaker: string,
): string => {
  return `${sanitize(documentId)}_${batchOrder}_${sanitize(speaker)}`;
};

export const getAudioCachePath = (key: string): string =>
  `${AUDIO_CACHE_DIR}${key}.wav`;

export const ensureAudioCacheDirectory = async (): Promise<void> => {
  const info = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);

  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
  }
};

export const writeAudioBase64ToFile = async (
  base64Audio: string,
  filePath: string,
): Promise<string> => {
  await ensureAudioCacheDirectory();
  await FileSystem.writeAsStringAsync(filePath, base64Audio, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return filePath;
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  const info = await FileSystem.getInfoAsync(filePath);
  return info.exists;
};
