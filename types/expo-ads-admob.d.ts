declare module 'expo-ads-admob' {
  export type AdMobRequestOptions = {
    servePersonalizedAds?: boolean;
  };

  export const AdMobInterstitial: {
    setAdUnitID(adUnitID: string): Promise<void>;
    requestAdAsync(options?: AdMobRequestOptions): Promise<void>;
    showAdAsync(): Promise<void>;
    dismissAdAsync(): Promise<void>;
  };

  export function setTestDeviceIDAsync(testingId: string | string[]): Promise<void>;
}
