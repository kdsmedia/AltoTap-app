import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { signIn, signInAsGuest, signingIn } = useAuth();
  const insets = useSafeAreaInsets();
  const botPad = Platform.OS === 'web' ? 48 : insets.bottom + 32;

  return (
    <View style={styles.container}>
      {/* Buttons centered in lower half of screen */}
      <View style={[styles.bottom, { paddingBottom: botPad }]}>
        {signingIn ? (
          <ActivityIndicator size="large" color="#FFD600" style={styles.loader} />
        ) : (
          <>
            <TouchableOpacity
              onPress={signIn}
              activeOpacity={0.82}
              style={styles.googleBtn}
              testID="google-sign-in"
            >
              <AntDesign name="google" size={22} color="#EA4335" />
              <Text style={styles.gText}>Masuk Dengan Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={signInAsGuest}
              activeOpacity={0.75}
              style={styles.guestBtn}
              testID="guest-sign-in"
            >
              <Text style={styles.guestText}>MASUK SEBAGAI TAMU</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.disclaimer}>
          Anda menyetujui Syarat &amp; Ketentuan{'\n'}serta Kebijakan Privasi.
        </Text>

        <Text style={styles.brand}>ALTOMEDIA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 40,
    gap: 14,
  },
  loader: {
    marginBottom: 8,
  },
  /* ── Yellow pill button ── */
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFD600',
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 50,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  gText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.3,
    fontFamily: 'Inter_700Bold',
  },
  /* ── Ghost pill button ── */
  guestBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  guestText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.5,
    fontFamily: 'Inter_700Bold',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2.5,
    fontFamily: 'Inter_700Bold',
  },
});
