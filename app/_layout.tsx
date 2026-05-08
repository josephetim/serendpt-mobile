import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
} from "@expo-google-fonts/eb-garamond";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ZenKakuGothicAntique_400Regular } from "@expo-google-fonts/zen-kaku-gothic-antique";
import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

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
    ...Feather.font,
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
    ...FontAwesome5.font,
    ...Entypo.font,
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ZenKakuGothicAntique_400Regular,
  });

  useEffect(() => {
    if (fontsError) {
      console.error("Font loading failed, continuing with available fonts.", fontsError);
    }
  }, [fontsError]);

  useEffect(() => {
    void hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

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
