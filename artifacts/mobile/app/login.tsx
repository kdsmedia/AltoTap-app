import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { signIn, signingIn } = useAuth();
  const insets = useSafeAreaInsets();
  const botPad = Platform.OS === 'web' ? 48 : insets.bottom + 32;

  return (
    <ImageBackground
      source={require('@/assets/images/login-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Floating UI elements pinned to the lower portion of the screen */}
      <View style={[styles.bottom, { paddingBottom: botPad }]}>
        {signingIn ? (
          <ActivityIndicator size="large" color="#FFD600" style={styles.loader} />
        ) : (
          <TouchableOpacity
            onPress={signIn}
            activeOpacity={0.82}
            style={styles.googleBtn}
            testID="google-sign-in"
          >
            <Image
              source={require('@/assets/images/google-icon.png')}
              style={styles.gIcon}
              resizeMode="contain"
            />
            <Text style={styles.gText}>Masuk Dengan Google</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.disclaimer}>
          Anda menyetujui Syarat &amp; Ketentuan{'\n'}serta Kebijakan Privasi.
        </Text>

        <Text style={styles.brand}>ALTOMEDIA</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 12,
  },
  loader: {
    marginBottom: 8,
  },
  /* ── Yellow pill button — matches reference screenshot ── */
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFD600',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 50,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  gIcon: {
    width: 28,
    height: 28,
  },
  gText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.3,
    fontFamily: 'Inter_700Bold',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 2.5,
    fontFamily: 'Inter_700Bold',
  },
});
