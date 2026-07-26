import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const BG = require('@/assets/images/app-bg.png');

interface Props {
  children: React.ReactNode;
  style?: object;
}

/**
 * Full-screen background wrapper using app-bg.png with a dark overlay
 * so UI content remains readable against the bright green background.
 */
export default function BgWrapper({ children, style }: Props) {
  return (
    <ImageBackground source={BG} style={[styles.root, style]} resizeMode="cover">
      <View style={styles.overlay} pointerEvents="none" />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
});
