import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";
import { AppIcon } from "../ui/AppIcon";

interface PageSelectorPillProps {
  pageLabel: string;
  onPress?: () => void;
}

export const PageSelectorPill = ({ pageLabel, onPress }: PageSelectorPillProps) => {
  return (
    <Pressable style={styles.pill} onPress={onPress}>
      <Text style={styles.text}>{pageLabel}</Text>
      <AppIcon name="chevronDown" size={scale(13)} color="#000000" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    minWidth: scale(85),
    height: verticalScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#FFFAEA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(5),
    paddingHorizontal: scale(10),
  },
  text: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    color: "#000000",
  },
});
