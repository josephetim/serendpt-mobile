import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Voice } from "../../types/api";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { AssistantState } from "./ListeningPill";
import { VoiceMiniCard } from "./VoiceMiniCard";

const aiAssistantIcon = require("../../../assets/icons/ai-assistant-icon.png");
const chatHistoryIcon = require("../../../assets/icons/chat-history-icon.png");

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
      {/* <Pressable style={styles.mainButton} onPress={onOpenAssistant}>
        <Image source={aiAssistantIcon} style={styles.mainIcon} resizeMode="contain" />
      </Pressable> */}
      <Pressable style={styles.historyButton} onPress={onOpenHistory}>
        <Image source={chatHistoryIcon} style={styles.historyIcon} resizeMode="contain" />
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
  mainIcon: {
    width: scale(62),
    height: scale(62),
  },
  historyButton: {
    width: scale(56),
    height: scale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  historyIcon: {
    width: scale(56),
    height: scale(56),
  },
});
