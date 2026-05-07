import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";

interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const PageControls = ({
  currentPage,
  totalPages,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: PageControlsProps) => {
  return (
    <View style={styles.wrap}>
      <Pressable
        disabled={!canGoPrevious}
        onPress={onPrevious}
        style={[styles.button, !canGoPrevious && styles.buttonDisabled]}
      >
        <Feather name="chevron-left" size={scale(16)} color="#000000" />
      </Pressable>
      <Text style={styles.text}>
        {currentPage} / {totalPages}
      </Text>
      <Pressable
        disabled={!canGoNext}
        onPress={onNext}
        style={[styles.button, !canGoNext && styles.buttonDisabled]}
      >
        <Feather name="chevron-right" size={scale(16)} color="#000000" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  button: {
    width: scale(32),
    height: scale(32),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  text: {
    fontFamily: "BrownStd",
    fontSize: moderateScale(13),
    color: "#212121",
  },
});
