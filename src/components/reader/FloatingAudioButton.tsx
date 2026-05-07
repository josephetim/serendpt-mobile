import React from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { moderateScale, scale } from "../../utils/responsive";

interface FloatingAudioButtonProps {
  status: "idle" | "loading" | "playing" | "paused" | "buffering" | "error";
  onPress: () => void;
}

export const FloatingAudioButton = ({ status, onPress }: FloatingAudioButtonProps) => {
  const isLoading = status === "loading" || status === "buffering";
  const isPlaying = status === "playing";
  const iconName = isPlaying ? "pause" : "play";

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={[styles.button, isLoading && styles.loading]}
    >
      {isLoading ? (
        <ActivityIndicator color="#000000" />
      ) : (
        <Feather name={iconName} size={scale(24)} color="#000000" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: scale(61),
    height: scale(61),
    borderRadius: moderateScale(31),
    backgroundColor: "#FFCC00",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  loading: {
    opacity: 0.85,
  },
});
