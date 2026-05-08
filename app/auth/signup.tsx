import React, { useMemo, useState } from "react";
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
import { Fonts } from "../../src/theme/fonts";

export default function SignupScreen() {
  const signupBg = require("../../assets/images/signup-bg.png");
  const { signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordMismatch = useMemo(() => {
    return Boolean(confirmPassword && password !== confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please complete all fields.");
      return;
    }
    if (passwordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signup({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      });

      if (result.requiresOtp) {
        router.push({
          pathname: "/auth/verify-otp",
          params: {
            email: email.trim(),
            purpose: "signup",
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
      eyebrow="GET STARTED"
      title="Create your Account"
      panelTopOffset={160}
      backgroundSource={signupBg}
    >
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FloatingLabelInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
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
        <FloatingLabelInput
          label="Repeat Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          secureToggle
          autoCapitalize="none"
          autoCorrect={false}
          error={passwordMismatch ? "Passwords do not match." : null}
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
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={styles.footerLink}>Login</Text>
          </Pressable>
        </Link>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  formContent: {
    paddingBottom: verticalScale(10),
    paddingTop: verticalScale(10),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(16),
    marginTop: verticalScale(8),
  },
  footerText: {
    fontFamily: Fonts.sansRegular,
    fontSize: scale(12.8),
    color: "#424242",
  },
  footerLink: {
    fontFamily: Fonts.sansRegular,
    fontSize: scale(12.8),
    color: "#212121",
    textDecorationLine: "underline",
  },
});
