import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { scale, verticalScale } from "../../utils/responsive";
import { PageSelectorPill } from "./PageSelectorPill";
import { AppIcon } from "../ui/AppIcon";

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
          <AppIcon name="aiAssistant" size={scale(20)} color="#000000" />
        </Pressable>
        <Pressable style={styles.fullscreenButton} onPress={onToggleFullscreen}>
          <AppIcon
            name={isFullscreen ? "exitFullscreen" : "fullscreen"}
            size={scale(21)}
            color="#000000"
          />
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
    width: scale(30),
    height: verticalScale(30),
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(8),
    gap: scale(6),
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
});
