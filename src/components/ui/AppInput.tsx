import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { moderateScale, verticalScale } from "../../utils/responsive";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export const AppInput = ({ label, error, style, ...props }: AppInputProps) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#70706F"
        style={[styles.input, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: verticalScale(6),
  },
  label: {
    color: "#424242",
    fontSize: moderateScale(13),
    fontFamily: "BrownStd",
  },
  input: {
    width: "100%",
    minHeight: verticalScale(52),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: "#424242",
    paddingHorizontal: moderateScale(16),
    fontSize: moderateScale(16),
    color: "#212121",
    fontFamily: "BrownStd",
    backgroundColor: "#FAFAFA",
  },
  error: {
    color: "#FF3B30",
    fontSize: moderateScale(12),
    fontFamily: "BrownStd",
  },
});
