import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { moderateScale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(24),
    gap: verticalScale(12),
  },
  message: {
    fontSize: moderateScale(14),
    textAlign: "center",
    color: "#FF3B30",
    fontFamily: Fonts.sansRegular,
    lineHeight: moderateScale(21),
  },
  button: {
    borderRadius: moderateScale(8),
    backgroundColor: "#212121",
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(13),
  },
});
