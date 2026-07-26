// AdMob dinonaktifkan sementara — fokus ke fitur & fungsi aplikasi dulu.
// Callback langsung dijalankan tanpa iklan.
// Aktifkan kembali dengan mengembalikan implementasi react-native-google-mobile-ads
// setelah fitur utama selesai dan siap untuk custom dev build.
export function useRewardedAd() {
  return {
    showAd: (onRewarded: () => void) => onRewarded(),
  };
}
