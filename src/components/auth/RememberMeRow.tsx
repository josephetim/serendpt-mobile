import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";

interface RememberMeRowProps {
  checked: boolean;
  onToggle: () => void;
  onForgotPassword?: () => void;
}

export const RememberMeRow = ({
  checked,
  onToggle,
  onForgotPassword,
}: RememberMeRowProps) => {
  return (
    <View style={styles.row}>
      <Pressable style={styles.left} onPress={onToggle}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <Feather name="check" size={scale(12)} color="#000000" /> : null}
        </View>
        <Text style={styles.text}>Remember me</Text>
      </Pressable>
      <Pressable onPress={onForgotPassword}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  checkbox: {
    width: scale(22),
    height: scale(22),
    borderRadius: moderateScale(3),
    borderWidth: 1,
    borderColor: "#FFCC00",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  checkboxChecked: {
    backgroundColor: "#FFCC00",
  },
  text: {
    fontFamily: "BrownStd",
    fontSize: moderateScale(13),
    color: "#000000",
  },
  forgot: {
    fontFamily: "BrownStd",
    fontSize: moderateScale(13),
    color: "#424242",
  },
});
