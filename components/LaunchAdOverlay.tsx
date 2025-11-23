import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Shield, Sparkles } from 'lucide-react-native';
import Colors from '../constants/colors';
import { admobConfig } from '../constants/admob';

const overlayTestId = 'launch-ad-overlay';
const fallbackCardTestId = 'launch-ad-fallback-card';
const ctaTestId = 'launch-ad-fallback-cta';
const closeTestId = 'launch-ad-fallback-close';

interface LaunchAdOverlayProps {
  appId?: string;
  adUnitId?: string;
  onClose: () => void;
}

type LaunchAdStatus = 'idle' | 'loading' | 'ready' | 'error' | 'dismissed';

type AdMobModule = {
  setTestDeviceIDAsync?: (testingId: string | string[]) => Promise<void>;
  AdMobInterstitial: {
    setAdUnitID: (adUnitID: string) => Promise<void>;
    requestAdAsync: (options?: { servePersonalizedAds?: boolean }) => Promise<void>;
    showAdAsync: () => Promise<void>;
    dismissAdAsync: () => Promise<void>;
  };
};

export default function LaunchAdOverlay({ appId, adUnitId, onClose }: LaunchAdOverlayProps) {
  const [status, setStatus] = useState<LaunchAdStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(true);

  const premiumPitch = useMemo(() => ({
    headline: 'Accès Premium Ultra Rentable',
    subheadline: 'Programme 30 jours + widgets lockscreen + conseils quotidiens exclusifs.',
    benefits: [
      'Débloquez le parcours guidé 30 jours',
      'Widgets iOS/Android pour garder la motivation',
      'Suivi avancé du temps et de l’argent gagné',
    ],
  }), []);

  const dismissOverlay = useCallback(async () => {
    setVisible(false);
    onClose();
  }, [onClose]);

  const resolvedAppId = appId ?? admobConfig.appId;
  const resolvedAdUnitId = adUnitId ?? admobConfig.appOpenAdUnitId;

  const initializeAdMob = useCallback(async () => {
    if (!visible || status !== 'idle') {
      return;
    }
    if (!resolvedAppId || !resolvedAdUnitId) {
      setErrorMessage('Configuration AdMob manquante. Veuillez définir les identifiants dans constants/admob.ts ou via les props.');
      setStatus('error');
      return;
    }
    console.log('[LaunchAdOverlay] initialize requested', { platform: Platform.OS, appId: resolvedAppId, adUnitId: resolvedAdUnitId });
    setStatus('loading');
    if (Platform.OS === 'web') {
      setErrorMessage('Les annonces AdMob ne sont pas disponibles dans la prévisualisation web. Lancez l’application sur iOS ou Android pour valider.');
      setStatus('error');
      return;
    }
    try {
      const moduleName = 'expo-ads-admob';
      const module = (await import(moduleName)) as unknown as AdMobModule;
      if (module.setTestDeviceIDAsync) {
        await module.setTestDeviceIDAsync('EMULATOR');
      }
      await module.AdMobInterstitial.setAdUnitID(resolvedAdUnitId);
      await module.AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      setStatus('ready');
      await module.AdMobInterstitial.showAdAsync();
      setStatus('dismissed');
      await module.AdMobInterstitial.dismissAdAsync();
    } catch (error) {
      console.log('[LaunchAdOverlay] unable to display AdMob interstitial', error);
      setErrorMessage('Impossible de charger la publicité d’ouverture. Assurez-vous de compiler avec un client Expo compatible AdMob.');
      setStatus('error');
    }
  }, [resolvedAdUnitId, resolvedAppId, status, visible]);

  useEffect(() => {
    if (status === 'dismissed') {
      dismissOverlay();
    }
  }, [dismissOverlay, status]);

  useEffect(() => {
    initializeAdMob();
  }, [initializeAdMob]);

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.backdrop} testID={overlayTestId}>
        {status === 'loading' && (
          <LinearGradient colors={[Colors.background, Colors.backgroundLight]} style={styles.loaderCard}>
            <View style={styles.iconWrap} testID="launch-ad-loading-icon">
              <Shield size={42} color={Colors.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.loadingTitle}>Chargement de votre récompense</Text>
            <Text style={styles.loadingSubtitle}>Préparation de la publicité personnalisée</Text>
            <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
          </LinearGradient>
        )}
        {status === 'error' && (
          <LinearGradient colors={[Colors.cardBackground, Colors.cardLight]} style={styles.fallbackCard} testID={fallbackCardTestId}>
            <View style={styles.fallbackIconRow}>
              <View style={styles.fallbackIconBadge}>
                <Flame size={42} color={Colors.primary} strokeWidth={2.5} fill={Colors.primary} />
              </View>
              <View style={styles.fallbackHeading}>
                <Text style={styles.fallbackTitle}>{premiumPitch.headline}</Text>
                <Text style={styles.fallbackSubtitle}>{premiumPitch.subheadline}</Text>
              </View>
            </View>
            <View style={styles.fallbackBenefits}>
              {premiumPitch.benefits.map((benefit) => (
                <View key={benefit} style={styles.fallbackBenefitRow} testID={`launch-ad-benefit-${benefit}`}>
                  <Sparkles size={18} color={Colors.primary} strokeWidth={2.5} />
                  <Text style={styles.fallbackBenefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.fallbackInfo}>{errorMessage}</Text>
            <Pressable style={styles.ctaButton} onPress={dismissOverlay} testID={ctaTestId}>
              <Text style={styles.ctaLabel}>Découvrir les offres premium</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={dismissOverlay} testID={closeTestId}>
              <Text style={styles.secondaryLabel}>Continuer sans publicité</Text>
            </Pressable>
          </LinearGradient>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loaderCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '800',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    marginTop: 12,
  },
  fallbackCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    padding: 28,
    gap: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fallbackIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  fallbackIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackHeading: {
    flex: 1,
    gap: 6,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600',
  },
  fallbackBenefits: {
    gap: 12,
  },
  fallbackBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fallbackBenefitText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '700',
  },
  fallbackInfo: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.background,
    letterSpacing: 0.4,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
});
