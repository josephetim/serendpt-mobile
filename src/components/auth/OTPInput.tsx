import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";

interface OTPInputProps {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
}

export const OTPInput = ({ value, onChangeText, length = 6 }: OTPInputProps) => {
  const sanitized = value.replace(/\D/g, "").slice(0, length);
  const chars = Array.from({ length }).map((_, index) => sanitized[index] ?? "");

  return (
    <View style={styles.wrap}>
      <TextInput
        value={sanitized}
        onChangeText={(nextValue) => onChangeText(nextValue.replace(/\D/g, "").slice(0, length))}
        keyboardType="number-pad"
        style={styles.hiddenInput}
        maxLength={length}
      />
      <View style={styles.row}>
        {chars.map((char, index) => (
          <View key={index} style={styles.slot}>
            <TextInput
              value={char}
              editable={false}
              pointerEvents="none"
              style={styles.slotText}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    marginBottom: verticalScale(18),
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: verticalScale(56),
    opacity: 0.01,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(10),
  },
  slot: {
    width: scale(47),
    height: verticalScale(56),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#424242",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  slotText: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.inputRegular,
    color: "#212121",
    textAlign: "center",
  },
});
