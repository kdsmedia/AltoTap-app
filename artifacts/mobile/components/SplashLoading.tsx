import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const BAR_PADDING = 48;
const DURATION_MS = 10000;

interface Props {
  onDone: () => void;
}

export default function SplashLoading({ onDone }: Props) {
  const [pct, setPct] = useState(0);
  const barAnim = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(false);

  useEffect(() => {
    // Animate the bar width 0 → full over 10 s
    Animated.timing(barAnim, {
      toValue: SCREEN_W - BAR_PADDING * 2,
      duration: DURATION_MS,
      useNativeDriver: false,
    }).start();

    // Increment % counter every 100 ms
    const interval = setInterval(() => {
      setPct(prev => {
        const next = Math.min(prev + 1, 100);
        if (next >= 100 && !doneRef.current) {
          doneRef.current = true;
          clearInterval(interval);
          setTimeout(onDone, 350);
        }
        return next;
      });
    }, DURATION_MS / 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {/* Full-screen splash image */}
      <Image
        source={require('@/assets/images/splash-bg.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Progress bar at bottom */}
      <View style={styles.bottom}>
        <View style={styles.barBg}>
          <Animated.View style={[styles.barFill, { width: barAnim }]} />
        </View>
        <Text style={styles.pctText}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D2B0D',
  },
  bottom: {
    position: 'absolute',
    bottom: 60,
    left: BAR_PADDING,
    right: BAR_PADDING,
    alignItems: 'center',
    gap: 10,
  },
  barBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  pctText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1,
  },
});
