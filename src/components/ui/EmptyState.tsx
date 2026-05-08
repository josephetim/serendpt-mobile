import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { moderateScale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(40),
    paddingHorizontal: moderateScale(20),
    gap: verticalScale(8),
  },
  title: {
    fontFamily: Fonts.serifMedium,
    fontSize: moderateScale(24),
    color: "#212121",
    textAlign: "center",
  },
  description: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(14),
    color: "#70706F",
    lineHeight: moderateScale(21),
    textAlign: "center",
  },
});
