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
import { AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { signIn, signInAsGuest, signingIn } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad  = Platform.OS === 'web' ? 48 : insets.top + 16;
  const botPad  = Platform.OS === 'web' ? 40 : insets.bottom + 24;

  return (
    <ImageBackground
      source={require('@/assets/images/login-bg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View pointerEvents="none" style={styles.backgroundOverlay} />
      {/* ── App Icon ── */}
      <View style={[styles.iconWrap, { marginTop: topPad + 12 }]}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>

      {/* ── Bottom Section ── */}
      <View style={[styles.bottom, { paddingBottom: botPad }]}>
        {signingIn ? (
          <ActivityIndicator size="large" color="#FFD600" />
        ) : (
          <>
            {/* Google button */}
            <TouchableOpacity
              onPress={signIn}
              activeOpacity={0.82}
              style={styles.googleBtn}
              testID="google-sign-in"
            >
              <AntDesign name="google" size={22} color="#EA4335" />
              <Text style={styles.gText}>Masuk Dengan Google</Text>
            </TouchableOpacity>

            {/* Guest button */}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 48, 10, 0.14)',
  },
  /* App icon centred in upper portion */
  iconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 196,
    height: 196,
    borderRadius: 42,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 20,
  },
  /* Bottom bar pinned to bottom */
  bottom: {
    alignItems: 'center',
    paddingHorizontal: 22,
    gap: 14,
    paddingTop: 10,
  },
  /* Yellow Google pill */
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFD600',
    minWidth: 286,
    paddingVertical: 15,
    paddingHorizontal: 26,
    borderRadius: 50,
    gap: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  gText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.2,
    fontFamily: 'Inter_700Bold',
  },
  /* Ghost pill for guest */
  guestBtn: {
    alignSelf: 'center',
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.72)',
    backgroundColor: 'rgba(0,35,8,0.34)',
  },
  guestText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.5,
    fontFamily: 'Inter_700Bold',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.94)',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2.5,
    fontFamily: 'Inter_700Bold',
  },
});
