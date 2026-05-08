import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { Fonts } from "../../theme/fonts";
import { AppIcon } from "../ui/AppIcon";

interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export const GoogleButton = ({ onPress, loading = false }: GoogleButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[styles.button, loading && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={styles.content}>
          <AppIcon name="google" size={scale(18)} color="#FFFFFF" />
          <Text style={styles.text}>Login/Sign up with google</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: verticalScale(55),
    borderRadius: moderateScale(17),
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(16),
  },
  disabled: {
    opacity: 0.72,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  text: {
    color: "#FFFFFF",
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(16),
  },
});
