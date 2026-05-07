import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";

interface FeatureBulletProps {
  text: string;
}

export const FeatureBullet = ({ text }: FeatureBulletProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Feather name="check" size={scale(12)} color="#FFFFFF" />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    marginBottom: verticalScale(10),
  },
  iconCircle: {
    width: scale(20),
    height: scale(20),
    borderRadius: moderateScale(10),
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "rgba(0,0,0,0.72)",
    fontFamily: "BrownStd",
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
  },
});
