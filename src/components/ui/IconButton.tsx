import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { moderateScale, scale } from "../../utils/responsive";

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const IconButton = ({
  icon,
  onPress,
  size = 34,
  backgroundColor = "#FFFFFF",
  borderColor = "rgba(0,0,0,0.08)",
  style,
}: IconButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          width: scale(size),
          height: scale(size),
          borderRadius: moderateScale(size / 2),
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
