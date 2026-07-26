/**
 * AdMob configuration for com.altomedia.altotap
 * App ID:      ca-app-pub-6881903056221433~2186020062
 * Reward unit: ca-app-pub-6881903056221433/8191925130
 */

const IS_DEV = __DEV__;

// Google's official test ad units for development/Expo Go
const TEST_APP_ID     = 'ca-app-pub-3940256099942544~3347511713';
const TEST_REWARDED   = 'ca-app-pub-3940256099942544/5224354917';

export const ADS = {
  androidAppId : IS_DEV ? TEST_APP_ID   : 'ca-app-pub-6881903056221433~2186020062',
  iosAppId     : IS_DEV ? TEST_APP_ID   : 'ca-app-pub-6881903056221433~2186020062',
  rewardedUnit : IS_DEV ? TEST_REWARDED : 'ca-app-pub-6881903056221433/8191925130',

  /** Points awarded after a full rewarded ad view */
  rewardPoints : 500,
} as const;
