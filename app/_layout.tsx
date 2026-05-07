import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  EBGaramond_400Regular,
  EBGaramond_500Medium,
} from "@expo-google-fonts/eb-garamond";
import { ZenKakuGothicAntique_400Regular } from "@expo-google-fonts/zen-kaku-gothic-antique";

import { useAuthStore } from "../src/store/authStore";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [fontsLoaded, fontsError] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    ZenKakuGothicAntique_400Regular,
    BrownStd: ZenKakuGothicAntique_400Regular,
    Georgia: EBGaramond_400Regular,
  });

  useEffect(() => {
    void hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if ((fontsLoaded || fontsError) && isHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const isRoot = pathname === "/";
    const inAuthFlow = segments[0] === "auth";

    if (isAuthenticated) {
      if (isRoot || inAuthFlow) {
        router.replace("/home");
      }
      return;
    }

    if (!isRoot && !inAuthFlow) {
      router.replace("/");
    }
  }, [isHydrated, isAuthenticated, segments, pathname, router]);

  if ((!fontsLoaded && !fontsError) || !isHydrated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="auth/verify-otp" />
      <Stack.Screen name="home" />
      <Stack.Screen name="reader/[documentId]" />
    </Stack>
  );
}
