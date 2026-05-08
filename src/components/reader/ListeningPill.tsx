import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";
import { AppIcon } from "../ui/AppIcon";

export type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "error";

interface ListeningPillProps {
  assistantState: AssistantState;
}

const getStatusLabel = (assistantState: AssistantState): string => {
  switch (assistantState) {
    case "listening":
      return "Listening...";
    case "thinking":
      return "Thinking...";
    case "speaking":
      return "Speaking...";
    case "error":
      return "Try again";
    default:
      return "AI Assistant";
  }
};

export const ListeningPill = ({ assistantState }: ListeningPillProps) => {
  const active = assistantState !== "idle";
  const loading = assistantState === "thinking";

  return (
    <View style={[styles.pill, active && styles.pillActive]}>
      {loading ? (
        <ActivityIndicator size="small" color="#FF3B30" />
      ) : (
        <View style={styles.iconWrap}>
          <AppIcon name="microphone" size={scale(15)} color="#000000" />
        </View>
      )}
      <Text style={styles.text}>{getStatusLabel(assistantState)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    minWidth: scale(129),
    height: verticalScale(36),
    borderRadius: moderateScale(26),
    backgroundColor: "#FFFBE8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    paddingHorizontal: scale(10),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  pillActive: {
    borderColor: "#F0D76A",
  },
  iconWrap: {
    width: scale(16),
    height: scale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(14),
    color: "#000000",
  },
});
