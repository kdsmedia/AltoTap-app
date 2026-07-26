// Web stub — AdMob Rewarded hanya tersedia di native.
// Callback langsung dijalankan tanpa iklan.
export function useRewardedAd() {
  return {
    showAd: (onRewarded: () => void) => onRewarded(),
  };
}
