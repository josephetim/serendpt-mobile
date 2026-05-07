import React from "react";
import { ImageBackground, ImageSourcePropType, StyleSheet, View } from "react-native";

interface AuthBackgroundProps {
  children: React.ReactNode;
  imageSource: ImageSourcePropType;
  overlayColor?: string;
  withOverlay?: boolean;
}

export const AuthBackground = ({
  children,
  imageSource,
  overlayColor = "rgba(0,0,0,0.25)",
  withOverlay = true,
}: AuthBackgroundProps) => {
  return (
    <ImageBackground source={imageSource} resizeMode="cover" style={styles.background}>
      {withOverlay ? <View style={[styles.overlay, { backgroundColor: overlayColor }]} /> : null}
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
