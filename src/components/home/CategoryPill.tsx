import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";

interface CategoryPillProps {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
}

export const CategoryPill = ({ label, icon }: CategoryPillProps) => {
  return (
    <View style={styles.pill}>
      <Feather name={icon} size={scale(15)} color="#70706F" />
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
    fontFamily: "BrownStd",
    fontSize: moderateScale(14),
  },
});
