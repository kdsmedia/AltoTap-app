/**
 * useRewardedAd — wraps react-native-google-mobile-ads rewarded ads.
 *
 * Gracefully degrades in Expo Go / web (simulates a 1.5 s "ad" then calls onReward).
 * In a native build (EAS / expo run:android) the real AdMob SDK is used.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { ADS } from '@/constants/ads';

// ── Safe lazy import (native module only available in native builds) ──────────
let NativeRewardedAd: any = null;
let NativeEventType: any = null;

try {
  const m = require('react-native-google-mobile-ads');
  NativeRewardedAd = m.RewardedAd;
  NativeEventType  = m.RewardedAdEventType;
} catch {
  // Expo Go / web — module not linked
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UseRewardedAdReturn {
  /** True while the ad is loading or while the simulated delay is running */
  isLoading: boolean;
  /** True once an ad is preloaded and ready to show (always true on web/dev) */
  isReady: boolean;
  /** Call this when the user presses "Watch Ad" */
  showAd: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRewardedAd(onReward: () => void): UseRewardedAdReturn {
  const isNative = Platform.OS !== 'web' && !!NativeRewardedAd;

  const [isLoading, setIsLoading] = useState(!isNative);
  const [isReady,   setIsReady]   = useState(!isNative); // web is always "ready"

  const adRef       = useRef<any>(null);
  const removersRef = useRef<Array<() => void>>([]);
  const onRewardRef = useRef(onReward);
  onRewardRef.current = onReward;

  const cleanup = () => {
    removersRef.current.forEach(r => r());
    removersRef.current = [];
  };

  const loadAd = useCallback(() => {
    if (!isNative) return;
    cleanup();
    setIsLoading(true);
    setIsReady(false);

    const ad = NativeRewardedAd.createForAdRequest(ADS.rewardedUnit, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;

    removersRef.current.push(
      ad.addAdEventListener(NativeEventType.LOADED, () => {
        setIsLoading(false);
        setIsReady(true);
      })
    );
    removersRef.current.push(
      ad.addAdEventListener(NativeEventType.EARNED_REWARD, () => {
        onRewardRef.current();
      })
    );
    removersRef.current.push(
      ad.addAdEventListener(NativeEventType.CLOSED, () => {
        setIsReady(false);
        loadAd(); // preload next ad immediately
      })
    );
    removersRef.current.push(
      ad.addAdEventListener(NativeEventType.ERROR, () => {
        setIsLoading(false);
        setIsReady(false);
        // retry after 30 s
        setTimeout(loadAd, 30_000);
      })
    );

    ad.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNative]);

  useEffect(() => {
    loadAd();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAd = useCallback(() => {
    if (!isNative) {
      // ── Expo Go / web simulation ──────────────────────────────────────────
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onRewardRef.current();
      }, 1500);
      return;
    }
    if (isReady && adRef.current) {
      adRef.current.show();
    }
  }, [isNative, isReady]);

  return { isLoading, isReady, showAd };
}
