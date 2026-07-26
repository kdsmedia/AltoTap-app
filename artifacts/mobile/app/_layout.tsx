import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GameProvider } from '@/context/GameContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/colors';
import SplashLoading from '@/components/SplashLoading';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Handles auth-based routing after splash
function AuthGate() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (authLoading) return;
    const onLoginScreen = segments[0] === 'login';
    if (!user && !onLoginScreen) {
      router.replace('/login');
    } else if (user && onLoginScreen) {
      router.replace('/');
    }
  }, [user, authLoading, segments]);

  return null;
}

function RootLayoutNav() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashLoading onDone={() => setSplashDone(true)} />;
  }

  return (
    <>
      <AuthGate />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="stats" options={{ title: 'Statistik', headerBackTitle: 'Kembali' }} />
        <Stack.Screen name="withdraw" options={{ title: 'Tarik Poin', headerBackTitle: 'Kembali' }} />
        <Stack.Screen name="topup" options={{ title: 'Isi Ulang VIP', headerBackTitle: 'Kembali' }} />
        <Stack.Screen name="transactions" options={{ title: 'Riwayat Transaksi', headerBackTitle: 'Kembali' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AuthProvider>
                <GameProvider>
                  <RootLayoutNav />
                </GameProvider>
              </AuthProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
