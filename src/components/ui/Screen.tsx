import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { moderateScale, verticalScale } from "../../utils/responsive";

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  keyboardAware?: boolean;
}

export const Screen = ({
  children,
  style,
  contentContainerStyle,
  scrollable = false,
  keyboardAware = false,
}: ScreenProps) => {
  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, contentContainerStyle]}>{children}</View>
  );

  const wrappedBody = keyboardAware ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardWrap}
    >
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return <SafeAreaView style={[styles.safe, style]}>{wrappedBody}</SafeAreaView>;
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  keyboardWrap: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(18),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(18),
    paddingBottom: verticalScale(20),
  },
});
