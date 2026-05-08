import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { resendOtp } from "../../src/api/auth";
import { OTPInput } from "../../src/components/auth/OTPInput";
import { AppButton } from "../../src/components/ui/AppButton";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { Screen } from "../../src/components/ui/Screen";
import { useAuth } from "../../src/hooks/useAuth";
import { normalizeError } from "../../src/utils/errors";
import { moderateScale, scale, verticalScale } from "../../src/utils/responsive";
import { Fonts } from "../../src/theme/fonts";

type OtpFlow = "signup" | "login";

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ email?: string; purpose?: OtpFlow }>();
  const {
    pendingOtpEmail,
    pendingOtpPurpose,
    verifyOtp,
    clearPendingOtp,
  } = useAuth();

  const resolvedEmail = useMemo(() => {
    if (typeof params.email === "string" && params.email.length > 0) {
      return params.email;
    }
    return pendingOtpEmail ?? "";
  }, [params.email, pendingOtpEmail]);

  const resolvedPurpose: OtpFlow = useMemo(() => {
    if (params.purpose === "signup" || params.purpose === "login") {
      return params.purpose;
    }
    return pendingOtpPurpose ?? "login";
  }, [params.purpose, pendingOtpPurpose]);

  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!resolvedEmail) {
      setError("Missing email for OTP verification. Please return and login/signup again.");
      return;
    }
    if (otpCode.length < 4) {
      setError("Please enter the OTP code.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const result = await verifyOtp(
        {
          email: resolvedEmail,
          otp_code: otpCode,
        },
        resolvedPurpose,
      );

      if (result.tokenReceived) {
        router.replace("/home");
        return;
      }

      clearPendingOtp();
      setNotice("Verification complete. Please login to continue.");
      router.replace("/auth/login");
    } catch (verifyError) {
      setError(normalizeError(verifyError).message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resolvedEmail) {
      setError("Missing email for OTP resend.");
      return;
    }
    setResending(true);
    setError(null);
    setNotice(null);
    try {
      await resendOtp({
        email: resolvedEmail,
        purpose: resolvedPurpose,
      });
      setNotice("A new OTP has been sent.");
    } catch (resendError) {
      setError(normalizeError(resendError).message);
    } finally {
      setResending(false);
    }
  };

  return (
    <Screen style={styles.screen} scrollable keyboardAware contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          {resolvedPurpose === "signup" ? "VERIFY ACCOUNT" : "VERIFY LOGIN"}
        </Text>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We sent a code to{" "}
          <Text style={styles.email}>{resolvedEmail || "your email address"}</Text>
        </Text>
      </View>

      <OTPInput value={otpCode} onChangeText={setOtpCode} />

      {error ? <ErrorState message={error} /> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}

      <AppButton
        title={resolvedPurpose === "signup" ? "Verify Signup" : "Verify Login"}
        onPress={handleVerify}
        loading={loading}
        variant={resolvedPurpose === "signup" ? "yellow" : "black"}
      />

      <Pressable onPress={handleResend} disabled={resending} style={styles.resendButton}>
        <Text style={styles.resendText}>
          {resending ? "Resending..." : "Resend OTP"}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  container: {
    paddingTop: verticalScale(30),
    paddingHorizontal: scale(24),
  },
  header: {
    marginBottom: verticalScale(26),
  },
  eyebrow: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(13),
    color: "#424242",
    marginBottom: verticalScale(3),
  },
  title: {
    fontFamily: Fonts.serifMedium,
    fontSize: moderateScale(42),
    lineHeight: moderateScale(48),
    color: "#000000",
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(14),
    color: "#70706F",
  },
  email: {
    color: "#212121",
  },
  notice: {
    marginBottom: verticalScale(14),
    color: "#212121",
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(13),
    textAlign: "center",
  },
  resendButton: {
    marginTop: verticalScale(14),
    alignSelf: "center",
  },
  resendText: {
    color: "#212121",
    fontFamily: Fonts.sansRegular,
    fontSize: moderateScale(14),
    textDecorationLine: "underline",
  },
});
