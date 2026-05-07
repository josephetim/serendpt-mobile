import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { scale, verticalScale } from "../../utils/responsive";
import { PageSelectorPill } from "./PageSelectorPill";

const aiAssistantIcon = require("../../../assets/icons/ai-assistant-icon.png");
const fullscreenIcon = require("../../../assets/icons/fullscreen-icon.png");

interface ReaderToolbarProps {
  pageLabel: string;
  onPageSelectorPress: () => void;
  onOpenAssistant: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const ReaderToolbar = ({
  pageLabel,
  onPageSelectorPress,
  onOpenAssistant,
  onToggleFullscreen,
  isFullscreen,
}: ReaderToolbarProps) => {
  return (
    <View style={styles.row}>
      <PageSelectorPill pageLabel={pageLabel} onPress={onPageSelectorPress} />
      <View style={styles.right}>
        <Pressable style={styles.assistantButton} onPress={onOpenAssistant}>
          <Image source={aiAssistantIcon} style={styles.assistantIcon} resizeMode="contain" />
          
        </Pressable>
        <Pressable style={styles.fullscreenButton} onPress={onToggleFullscreen}>
          <Image source={fullscreenIcon} style={styles.fullscreenIcon} resizeMode="contain" />
          {isFullscreen ? (
            <Feather
              name="minimize-2"
              size={scale(10)}
              color="#000000"
              style={styles.minimizeGlyph}
            />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  assistantButton: {
    height: verticalScale(32),
    borderRadius: scale(16),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(8),
    gap: scale(6),
  },
  assistantIcon: {
    width: scale(32),
    height: scale(32),
  },
  assistantLabel: {
    fontFamily: "BrownStd",
    color: "#212121",
    fontSize: scale(11.5),
  },
  fullscreenButton: {
    width: scale(29),
    height: scale(29),
    borderRadius: scale(14.5),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  fullscreenIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: "#000000",
  },
  minimizeGlyph: {
    position: "absolute",
    right: scale(4),
    bottom: scale(3),
  },
});
