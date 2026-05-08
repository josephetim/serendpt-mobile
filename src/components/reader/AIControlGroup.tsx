import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Voice } from "../../types/api";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { AssistantState } from "./ListeningPill";
import { VoiceMiniCard } from "./VoiceMiniCard";
import { AppIcon } from "../ui/AppIcon";

interface AIControlGroupProps {
  assistantState: AssistantState;
  selectedVoice: Voice | null;
  onOpenAssistant: () => void;
  onOpenHistory: () => void;
  onSelectVoice: () => void;
}

export const AIControlGroup = ({
  assistantState,
  selectedVoice,
  onOpenAssistant,
  onOpenHistory,
  onSelectVoice,
}: AIControlGroupProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + verticalScale(24),
          right: scale(16),
        },
      ]}
    >
      <Pressable style={styles.mainButton} onPress={onOpenAssistant}>
        <AppIcon name="aiAssistant" size={scale(28)} color="#000000" />
      </Pressable>
      <Pressable style={styles.historyButton} onPress={onOpenHistory}>
        <AppIcon name="chatHistory" size={scale(23)} color="#000000" />
      </Pressable>
      <Pressable onPress={onSelectVoice}>
        <VoiceMiniCard
          voice={selectedVoice}
          visualizerActive={assistantState === "speaking"}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "flex-end",
    gap: verticalScale(10),
  },
  mainButton: {
    width: scale(64),
    height: scale(64),
    borderRadius: moderateScale(32),
    backgroundColor: "#FFCC00",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  historyButton: {
    width: scale(56),
    height: scale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#FFFBE8",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});
