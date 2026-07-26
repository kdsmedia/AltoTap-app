/**
 * MiniCardBg — drops the minicard-bg image as an absolute background
 * inside any View/TouchableOpacity card container.
 *
 * Usage: render as the FIRST child of the card wrapper.
 *
 *   <View style={styles.card}>
 *     <MiniCardBg radius={12} />
 *     …content…
 *   </View>
 */
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const SOURCE = require('@/assets/images/minicard-bg.png');

interface Props {
  radius?: number;
}

export default function MiniCardBg({ radius = 12 }: Props) {
  return (
    <ImageBackground
      source={SOURCE}
      resizeMode="stretch"
      style={StyleSheet.absoluteFillObject}
      imageStyle={{ borderRadius: radius }}
    />
  );
}
