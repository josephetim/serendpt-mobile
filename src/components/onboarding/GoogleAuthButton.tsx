import React, { useEffect, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { useAuth } from "../../hooks/useAuth";
import { normalizeError } from "../../utils/errors";
import { GoogleButton } from "./GoogleButton";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "";
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

interface GoogleAuthButtonProps {
  onAuthenticated: () => void;
  onOtpRequired: () => void;
}

const getPlatformClientId = (): string => {
  if (Platform.OS === "android") {
    return GOOGLE_ANDROID_CLIENT_ID;
  }
  if (Platform.OS === "ios") {
    return GOOGLE_IOS_CLIENT_ID;
  }
  return GOOGLE_WEB_CLIENT_ID;
};

const UnconfiguredGoogleButton = () => {
  const handlePress = () => {
    Alert.alert(
      "Google sign-in unavailable",
      "Google sign-in is not configured. Add Google client IDs to your .env file.",
    );
  };

  return <GoogleButton onPress={handlePress} />;
};

const ConfiguredGoogleButton = ({
  onAuthenticated,
  onOtpRequired,
}: GoogleAuthButtonProps) => {
  const { googleAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const platformClientId = getPlatformClientId();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: platformClientId,
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
  });

  useEffect(() => {
    const run = async () => {
      if (!response) {
        return;
      }

      if (response.type !== "success") {
        setIsLoading(false);
        return;
      }

      const idToken = response.params?.id_token;
      if (!idToken) {
        setIsLoading(false);
        Alert.alert("Google sign-in failed", "No ID token was returned.");
        return;
      }

      try {
        const result = await googleAuth(idToken);
        if (result.requiresOtp) {
          onOtpRequired();
          return;
        }
        onAuthenticated();
      } catch (error) {
        Alert.alert("Google sign-in failed", normalizeError(error).message);
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [response, googleAuth, onAuthenticated, onOtpRequired]);

  const handlePress = async () => {
    if (!request) {
      Alert.alert(
        "Google sign-in unavailable",
        "Google sign-in request is not ready yet. Please try again.",
      );
      return;
    }

    setIsLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Google sign-in failed", normalizeError(error).message);
    }
  };

  return <GoogleButton onPress={() => void handlePress()} loading={isLoading} />;
};

export const GoogleAuthButton = ({
  onAuthenticated,
  onOtpRequired,
}: GoogleAuthButtonProps) => {
  const isConfigured = useMemo(() => Boolean(getPlatformClientId()), []);

  if (!isConfigured) {
    return <UnconfiguredGoogleButton />;
  }

  return (
    <ConfiguredGoogleButton
      onAuthenticated={onAuthenticated}
      onOtpRequired={onOtpRequired}
    />
  );
};
