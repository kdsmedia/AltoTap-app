import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { COLORS } from '@/constants/colors';

const AD_UNIT_ID = 'ca-app-pub-6881903056221433/6767996974';

export const AD_STRIP_HEIGHT = 66; // total height reserved for the banner strip

export default function AdBannerBar() {
  const [loaded, setLoaded] = useState(false);

  if (Platform.OS === 'web') return null;

  return (
    <View style={styles.strip}>
      {/* Outer 3D frame — raised bevel */}
      <View style={styles.frame3dOuter}>
        {/* Inner 3D frame — inset bevel, creates depth */}
        <View style={styles.frame3dInner}>
          {/* Gloss line at the very top */}
          <View style={styles.glossLine} />

          {/* Ad container */}
          <View style={[styles.adContainer, loaded && styles.adContainerLoaded]}>
            <BannerAd
              unitId={AD_UNIT_ID}
              size={BannerAdSize.BANNER}
              requestOptions={{ requestNonPersonalizedAdsOnly: true }}
              onAdLoaded={() => setLoaded(true)}
              onAdFailedToLoad={() => setLoaded(false)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: AD_STRIP_HEIGHT,
    backgroundColor: '#0a0e0a',
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle separator line below the strip
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldDark,
  },

  // Outer raised bevel: bright on top-left, dark on bottom-right
  frame3dOuter: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: COLORS.goldLight,    // highlight
    borderLeftColor: COLORS.goldLight,   // highlight
    borderBottomColor: '#3a2800',        // deep shadow
    borderRightColor: '#3a2800',         // deep shadow
    borderRadius: 4,
    padding: 2,
    backgroundColor: COLORS.goldDark,
    // Drop shadow for lifted look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 10,
  },

  // Inner inset bevel: dark on top-left, bright on bottom-right (recessed)
  frame3dInner: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: '#2a1800',           // inner shadow
    borderLeftColor: '#2a1800',          // inner shadow
    borderBottomColor: COLORS.goldLight, // inner highlight
    borderRightColor: COLORS.goldLight,  // inner highlight
    borderRadius: 2,
    backgroundColor: '#111510',
    overflow: 'hidden',
  },

  // Thin gloss line at the top inside the frame
  glossLine: {
    height: 2,
    backgroundColor: 'rgba(255, 229, 102, 0.25)',
  },

  adContainer: {
    width: 320,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111510',
  },

  adContainerLoaded: {
    backgroundColor: 'transparent',
  },
});
