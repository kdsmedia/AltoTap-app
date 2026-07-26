import { useCallback, useEffect, useRef } from 'react';
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = 'ca-app-pub-6881903056221433/8191925130';

/**
 * Hook yang mengelola satu instance RewardedAd.
 * Gunakan showAd(callback) — callback dipanggil setelah iklan selesai ditonton.
 * Jika iklan belum siap, callback langsung dipanggil sebagai fallback.
 */
export function useRewardedAd() {
  const adRef = useRef<RewardedAd | null>(null);
  const isLoadedRef = useRef(false);
  const pendingRewardRef = useRef<(() => void) | null>(null);

  const load = useCallback(() => {
    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubLoad = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      isLoadedRef.current = true;
    });

    const unsubReward = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        pendingRewardRef.current?.();
        pendingRewardRef.current = null;
      },
    );

    // Setelah iklan ditutup (baik selesai maupun diskip), muat ulang
    const unsubClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
      isLoadedRef.current = false;
      pendingRewardRef.current = null; // Bersihkan jika diskip sebelum reward
      unsubLoad();
      unsubReward();
      unsubClose();
      load(); // Muat iklan berikutnya
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      isLoadedRef.current = false;
      unsubLoad();
      unsubReward();
      unsubClose();
      unsubError();
      // Coba lagi setelah 30 detik jika gagal
      setTimeout(load, 30_000);
    });

    ad.load();
    adRef.current = ad;
  }, []);

  useEffect(() => {
    load();
    return () => {
      adRef.current = null;
      isLoadedRef.current = false;
    };
  }, [load]);

  /**
   * Tampilkan iklan reward. Jika iklan belum siap, langsung jalankan callback.
   */
  const showAd = useCallback((onRewarded: () => void) => {
    if (isLoadedRef.current && adRef.current) {
      pendingRewardRef.current = onRewarded;
      adRef.current.show();
    } else {
      // Fallback: iklan belum siap — tetap jalankan aksi
      onRewarded();
    }
  }, []);

  return { showAd };
}
