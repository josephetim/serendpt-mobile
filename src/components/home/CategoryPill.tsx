import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";
import { AppIcon, AppIconName } from "../ui/AppIcon";

interface CategoryPillProps {
  label: string;
  icon: AppIconName;
}

export const CategoryPill = ({ label, icon }: CategoryPillProps) => {
  return (
    <View style={styles.pill}>
      <AppIcon name={icon} size={scale(15)} color="#70706F" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    minWidth: scale(134),
    height: verticalScale(37),
    borderRadius: moderateScale(22),
    borderWidth: 1,
    borderColor: "#F4F4F3",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
  },
  label: {
    color: "#70706F",
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(14),
  },
});
