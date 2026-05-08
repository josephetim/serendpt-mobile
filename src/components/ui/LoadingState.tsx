import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { moderateScale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#212121" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(28),
    gap: verticalScale(10),
  },
  message: {
    fontSize: moderateScale(14),
    color: "#424242",
    fontFamily: Fonts.sansRegular,
  },
});
