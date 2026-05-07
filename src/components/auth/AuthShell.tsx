import React from "react";
import {
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { moderateScale, scale, verticalScale } from "../../utils/responsive";
import { AuthBackground } from "./AuthBackground";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  panelTopOffset: number;
  backgroundSource: ImageSourcePropType;
}

export const AuthShell = ({
  eyebrow,
  title,
  children,
  panelTopOffset,
  backgroundSource,
}: AuthShellProps) => {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <AuthBackground
        imageSource={backgroundSource}
        overlayColor="rgba(0,0,0,0.25)"
      >
        <KeyboardAvoidingView
          style={styles.keyboardWrap}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.sheet, { marginTop: verticalScale(panelTopOffset) }]}>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>{eyebrow}</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
            {children}
          </View>
        </KeyboardAvoidingView>
      </AuthBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000000",
  },
  keyboardWrap: {
    flex: 1,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    backgroundColor: "#FAFAFA",
    paddingHorizontal: scale(22),
    paddingTop: verticalScale(28),
  },
  header: {
    marginBottom: verticalScale(20),
    gap: verticalScale(2),
  },
  eyebrow: {
    fontFamily: "BrownStd",
    fontSize: moderateScale(13),
    lineHeight: moderateScale(22),
    color: "#000000",
    letterSpacing: 0.2,
  },
  title: {
    fontFamily: "EBGaramond_500Medium",
    fontSize: moderateScale(35),
    lineHeight: moderateScale(44),
    color: "#000000",
  },
});
