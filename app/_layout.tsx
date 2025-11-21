import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LaunchAdOverlay from "../components/LaunchAdOverlay";
import { AppProvider } from "../contexts/AppContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [showLaunchAd, setShowLaunchAd] = useState<boolean>(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (showLaunchAd) {
      console.log('[RootLayout] presenting launch ad overlay');
    }
  }, [showLaunchAd]);

  const handleLaunchAdClose = useCallback(() => {
    console.log('[RootLayout] launch ad overlay dismissed');
    setShowLaunchAd(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {showLaunchAd && (
              <LaunchAdOverlay
                appId="ca-app-pub-9459814148260617~9154419997"
                adUnitId="ca-app-pub-9459814148260617/3806724545"
                onClose={handleLaunchAdClose}
              />
            )}
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AppProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
