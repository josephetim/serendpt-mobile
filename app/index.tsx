import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { AppButton } from "../src/components/ui/AppButton";
import { Screen } from "../src/components/ui/Screen";
import { FeatureBullet } from "../src/components/onboarding/FeatureBullet";
import { GoogleAuthButton } from "../src/components/onboarding/GoogleAuthButton";
import { useAuth } from "../src/hooks/useAuth";
import { moderateScale, scale, verticalScale } from "../src/utils/responsive";

export default function OnboardingScreen() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    router.replace("/home");
  }, [isAuthenticated]);

  return (
    <Screen style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.illustrationWrap}>
        <Image
          source={require("../assets/images/abstrakt-design.png")}
          resizeMode="contain"
          style={styles.illustration}
        />
      </View>

      <Text style={styles.title}>Your reading companion</Text>

      <View style={styles.featureWrap}>
        <FeatureBullet text="reads aloud to you" />
        <FeatureBullet text="answers any question" />
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="Login"
          onPress={() => router.push("/auth/login")}
          variant="yellow"
          style={styles.halfButton}
        />
        <AppButton
          title="Sign up"
          onPress={() => router.push("/auth/signup")}
          variant="cream"
          style={styles.halfButton}
        />
      </View>

      <GoogleAuthButton
        onAuthenticated={() => router.replace("/home")}
        onOtpRequired={() =>
          router.push({
            pathname: "/auth/verify-otp",
            params: {
              purpose: "login",
            },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(27),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(30),
  },
  illustrationWrap: {
    alignSelf: "flex-start",
    marginLeft: scale(-22),
    marginBottom: verticalScale(14),
  },
  illustration: {
    width: scale(364),
    height: scale(364),
    opacity: 0.94,
  },
  title: {
    alignSelf: "center",
    maxWidth: scale(263),
    textAlign: "center",
    fontFamily: "EBGaramond_400Regular",
    color: "#000000",
    fontSize: moderateScale(50),
    lineHeight: moderateScale(60),
    marginBottom: verticalScale(22),
  },
  featureWrap: {
    alignSelf: "center",
    marginBottom: verticalScale(42),
  },
  actionRow: {
    flexDirection: "row",
    gap: scale(10),
    marginBottom: verticalScale(18),
  },
  halfButton: {
    flex: 1,
  },
});
