import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";

type ButtonVariant = "yellow" | "cream" | "black" | "outline";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
  yellow: { bg: "#FFCC00", fg: "#000000" },
  cream: { bg: "#FDF4CF", fg: "#000000" },
  black: { bg: "#212121", fg: "#FFFFFF" },
  outline: { bg: "#FFFFFF", fg: "#212121", border: "#E2E2E2" },
};

export const AppButton = ({
  title,
  onPress,
  variant = "yellow",
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) => {
  const visual = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: visual.bg,
          borderColor: visual.border ?? visual.bg,
          opacity: isDisabled ? 0.72 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={visual.fg} />
      ) : (
        <Text style={[styles.label, { color: visual.fg }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: verticalScale(55),
    borderRadius: moderateScale(17),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(16),
  },
  label: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontFamily: Fonts.sansRegular,
  },
});
