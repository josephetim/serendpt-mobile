import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";

import { AuthShell } from "../../src/components/auth/AuthShell";
import { FloatingLabelInput } from "../../src/components/auth/FloatingLabelInput";
import { RememberMeRow } from "../../src/components/auth/RememberMeRow";
import { AppButton } from "../../src/components/ui/AppButton";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { useAuth } from "../../src/hooks/useAuth";
import { normalizeError } from "../../src/utils/errors";
import { scale, verticalScale } from "../../src/utils/responsive";

export default function LoginScreen() {
  const loginBg = require("../../assets/images/auth-bg.png");
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      if (result.requiresOtp) {
        router.push({
          pathname: "/auth/verify-otp",
          params: {
            email: email.trim(),
            purpose: "login",
          },
        });
        return;
      }

      router.replace("/home");
    } catch (submitError) {
      setError(normalizeError(submitError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Log In to your Account"
      panelTopOffset={296}
      backgroundSource={loginBg}
    >
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FloatingLabelInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FloatingLabelInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          secureToggle
          autoCapitalize="none"
          autoCorrect={false}
        />

        <RememberMeRow
          checked={rememberMe}
          onToggle={() => setRememberMe((prev) => !prev)}
          onForgotPassword={() =>
            Alert.alert(
              "Not available",
              "Forgot password flow is not included in this app scope yet.",
            )
          }
        />

        {error ? <ErrorState message={error} /> : null}

        <AppButton
          title="CONTINUE"
          onPress={handleSubmit}
          loading={loading}
          variant="black"
        />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Link href="/auth/signup" asChild>
          <Pressable>
            <Text style={styles.footerLink}>Sign up</Text>
          </Pressable>
        </Link>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  formContent: {
    paddingBottom: verticalScale(18),
    paddingTop: verticalScale(10),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(18),
    marginTop: verticalScale(8),
  },
  footerText: {
    fontFamily: "BrownStd",
    fontSize: scale(12.8),
    color: "#424242",
  },
  footerLink: {
    fontFamily: "BrownStd",
    fontSize: scale(12.8),
    color: "#212121",
    textDecorationLine: "underline",
  },
});
