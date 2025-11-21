import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Linking,
  Alert,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertCircle,
  Wind,
  Heart,
  Waves,
  X,
  PhoneCall,
  MessageCircle,
  Headphones,
  Brain,
  ShieldCheck,
  Flame,
} from 'lucide-react-native';
import Colors from '../../constants/colors';
import { useApp, useStats } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');

const BREATHING_PHASES = [
  {
    label: 'Inspirez profondément',
    duration: 4500,
    color: Colors.primary,
    instruction: 'Fais entrer l’air lentement par le nez en gonflant ton ventre.',
    mantra: 'Je nourris mon corps d’oxygène et de calme.',
  },
  {
    label: 'Retenez la respiration',
    duration: 3500,
    color: Colors.secondary,
    instruction: 'Maintiens la respiration, garde les épaules relâchées.',
    mantra: 'Je contrôle mon rythme intérieur.',
  },
  {
    label: 'Expirez tout doucement',
    duration: 6500,
    color: Colors.blue,
    instruction: 'Laisse l’air sortir par la bouche comme si tu soufflais dans une paille.',
    mantra: 'Je libère la tension et l’envie.',
  },
] as const;

type BreathingPhase = typeof BREATHING_PHASES[number];

const phaseCount = BREATHING_PHASES.length;

const INITIAL_SCALE = 0.82;

type QuickActionId = 'call' | 'text' | 'focus' | 'audio' | 'shield' | 'fire';

interface QuickAction {
  id: QuickActionId;
  title: string;
  subtitle: string;
  primaryColor: string;
  accent: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'call',
    title: 'Appeler un allié',
    subtitle: 'Contacte ton soutien immédiat',
    primaryColor: 'rgba(255, 255, 255, 0.18)',
    accent: Colors.primary,
  },
  {
    id: 'text',
    title: 'Envoyer un message',
    subtitle: 'Préviens ton coach ou ton partenaire',
    primaryColor: 'rgba(255, 255, 255, 0.16)',
    accent: Colors.secondary,
  },
  {
    id: 'focus',
    title: 'Routine anti-craving',
    subtitle: 'Eau fraîche + marche rapide',
    primaryColor: 'rgba(255, 255, 255, 0.14)',
    accent: Colors.accent,
  },
  {
    id: 'audio',
    title: 'Mettre un audio détente',
    subtitle: 'Respiration guidée 4-7-8',
    primaryColor: 'rgba(255, 255, 255, 0.12)',
    accent: Colors.purple,
  },
  {
    id: 'shield',
    title: 'Rappel bouclier',
    subtitle: 'Liste tes raisons d’arrêter',
    primaryColor: 'rgba(255, 255, 255, 0.1)',
    accent: Colors.danger,
  },
  {
    id: 'fire',
    title: 'Brûle l’envie mentalement',
    subtitle: 'Visualisation anti-rechute',
    primaryColor: 'rgba(255, 255, 255, 0.1)',
    accent: Colors.orange,
  },
];

const QUICK_ACTION_ICONS: Record<QuickActionId, React.ComponentType<{ color?: string; size?: number }>> = {
  call: PhoneCall,
  text: MessageCircle,
  focus: Brain,
  audio: Headphones,
  shield: ShieldCheck,
  fire: Flame,
};

export default function EmergencyScreen() {
  const insets = useSafeAreaInsets();
  const { addCraving, userData } = useApp();
  const stats = useStats();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(Math.ceil(BREATHING_PHASES[0].duration / 1000));
  const [mantra, setMantra] = useState<string>(BREATHING_PHASES[0].mantra);

  const scaleAnim = useRef(new Animated.Value(INITIAL_SCALE)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const clearTimers = useCallback(() => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearTimers();
      waveLoopRef.current?.stop();
      glowLoopRef.current?.stop();
    };
  }, [clearTimers]);

  const startWaveIdleAnimation = useCallback(() => {
    waveLoopRef.current?.stop();
    waveAnim.stopAnimation();
    waveAnim.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    waveLoopRef.current = loop;
    loop.start();
  }, [waveAnim]);

  const stopWaveIdleAnimation = useCallback(() => {
    waveLoopRef.current?.stop();
    waveAnim.stopAnimation();
    waveAnim.setValue(0);
  }, [waveAnim]);

  const ensureGlowAnimation = useCallback(() => {
    glowLoopRef.current?.stop();
    glowAnim.stopAnimation();
    glowAnim.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    glowLoopRef.current = loop;
    loop.start();
  }, [glowAnim]);

  const handlePhaseTransition = useCallback((targetPhaseIndex: number) => {
    const phase: BreathingPhase = BREATHING_PHASES[targetPhaseIndex];
    const scaleTarget = targetPhaseIndex === 0 ? 1.15 : targetPhaseIndex === 1 ? 1.05 : 0.78;
    const opacityTarget = targetPhaseIndex === 1 ? 1 : targetPhaseIndex === 0 ? 0.9 : 0.72;

    scaleAnim.stopAnimation();
    opacityAnim.stopAnimation();

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: scaleTarget,
        duration: phase.duration,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: opacityTarget,
        duration: phase.duration * 0.6,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    setMantra(phase.mantra);
    setSecondsLeft(Math.ceil(phase.duration / 1000));
    console.log('[EmergencyScreen] Phase transition', phase.label, 'duration', phase.duration);

    clearTimers();

    tickTimerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    phaseTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) {
        return;
      }
      setPhaseIndex((prev) => (prev + 1) % phaseCount);
    }, phase.duration);
  }, [clearTimers, opacityAnim, scaleAnim]);

  useEffect(() => {
    if (isActive) {
      stopWaveIdleAnimation();
      ensureGlowAnimation();
      handlePhaseTransition(phaseIndex);
      return () => {
        clearTimers();
      };
    }
    clearTimers();
    glowLoopRef.current?.stop();
    glowAnim.stopAnimation();
    glowAnim.setValue(0);
    scaleAnim.stopAnimation();
    scaleAnim.setValue(INITIAL_SCALE);
    opacityAnim.stopAnimation();
    opacityAnim.setValue(1);
    setMantra(BREATHING_PHASES[0].mantra);
    setSecondsLeft(Math.ceil(BREATHING_PHASES[0].duration / 1000));
    startWaveIdleAnimation();
    return () => {
      waveLoopRef.current?.stop();
    };
  }, [
    isActive,
    phaseIndex,
    clearTimers,
    ensureGlowAnimation,
    stopWaveIdleAnimation,
    startWaveIdleAnimation,
    handlePhaseTransition,
    glowAnim,
    opacityAnim,
    scaleAnim,
  ]);

  useEffect(() => {
    if (!isActive && waveLoopRef.current === null) {
      startWaveIdleAnimation();
    }
  }, [isActive, startWaveIdleAnimation]);

  const handleStart = useCallback(() => {
    console.log('[EmergencyScreen] Breathing session started');
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((error) => {
        console.log('[EmergencyScreen] Haptics error on start', error);
      });
    }
    setPhaseIndex(0);
    setIsActive(true);
  }, []);

  const handleStop = useCallback(() => {
    console.log('[EmergencyScreen] Breathing session completed');
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch((error) => {
        console.log('[EmergencyScreen] Haptics error on stop', error);
      });
    }
    clearTimers();
    addCraving({ avoided: true, intensity: 4 });
    setIsActive(false);
    setPhaseIndex(0);
  }, [addCraving, clearTimers]);

  const handleQuickActionPress = useCallback((action: QuickAction) => {
    console.log('[EmergencyScreen] Quick action tapped', action.id);
    switch (action.id) {
      case 'call':
        Linking.openURL('tel://+33123456789').catch(() => {
          Alert.alert('Impossible d’ouvrir le téléphone', 'Ajoute ton contact d’urgence depuis ton profil.');
        });
        break;
      case 'text':
        Linking.openURL('sms:+33123456789').catch(() => {
          Alert.alert('Impossible d’ouvrir les messages', 'Vérifie l’application SMS de ton appareil.');
        });
        break;
      case 'audio':
        Linking.openURL('https://www.youtube.com/watch?v=TxgMQz1gltI').catch(() => {
          Alert.alert('Lecture impossible', 'Ouvre ce lien dans ton navigateur pour lancer l’audio.');
        });
        break;
      default:
        Alert.alert('Routine activée', action.subtitle);
        break;
    }
  }, []);

  const currentPhase: BreathingPhase = useMemo(() => BREATHING_PHASES[phaseIndex], [phaseIndex]);

  const waveScale = useMemo(
    () =>
      waveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.25],
      }),
    [waveAnim],
  );

  const waveOpacity = useMemo(
    () =>
      waveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 0],
      }),
    [waveAnim],
  );

  const glowOpacity = useMemo(
    () =>
      glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.7],
      }),
    [glowAnim],
  );

  const headlineStats = useMemo(() => {
    const days = Math.max(0, Math.floor(stats.daysSinceQuit ?? 0));
    const cravingsAvoided = Math.max(0, stats.cravingsAvoided ?? 0);
    const money = Math.max(0, stats.moneySaved ?? 0);
    return [
      {
        label: 'Jours sans fumer',
        value: days.toString(),
      },
      {
        label: 'Envies neutralisées',
        value: cravingsAvoided.toString(),
      },
      {
        label: 'Économies',
        value: `${money.toFixed(0)}${userData.currency}`,
      },
    ];
  }, [stats, userData.currency]);

  return (
    <>
      <Stack.Screen options={{ title: 'Mode Urgence', headerShown: false }} />
      <LinearGradient
        colors={['#160812', '#2E0C1E', '#08020A']}
        style={[styles.container, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.32)', 'rgba(255, 255, 255, 0.08)']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <AlertCircle size={34} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
            <Text style={styles.headerTitle}>Mode Urgence</Text>
            <Text style={styles.headerSubtitle}>Respiration guidée + plan express anti-rechute</Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroLabel}>Continue de gagner</Text>
              <View style={styles.heroStatsRow}>
                {headlineStats.map((stat) => (
                  <View key={stat.label} style={styles.heroStat}>
                    <Text style={styles.heroStatValue}>{stat.value}</Text>
                    <Text style={styles.heroStatLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.heroMantra}>{mantra}</Text>
          </View>

          <View style={styles.breathingCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>Routine SOS Craving</Text>
              <Text style={styles.sessionSubtitle}>Cycle respiratoire 4-3-6 validé scientifiquement</Text>
            </View>

            <View style={styles.breathingContent}>
              {!isActive && (
                <Animated.View pointerEvents="none" style={[styles.waveCircle, { transform: [{ scale: waveScale }], opacity: waveOpacity }]} />
              )}
              {!isActive && (
                <Animated.View pointerEvents="none" style={[styles.waveCircleSecondary, { transform: [{ scale: waveScale }], opacity: waveOpacity }]} />
              )}
              {isActive && (
                <Animated.View pointerEvents="none" style={[styles.breathingGlow, { opacity: glowOpacity }]} />
              )}

              <Animated.View
                style={[
                  styles.breathingCore,
                  {
                    transform: [{ scale: isActive ? scaleAnim : INITIAL_SCALE }],
                    opacity: isActive ? opacityAnim : 1,
                  },
                ]}
              >
                <LinearGradient
                  colors={[currentPhase.color, `${currentPhase.color}CC`]}
                  style={styles.breathingCoreGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Heart size={48} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
                </LinearGradient>
              </Animated.View>

              <View style={styles.phaseInfo}>
                <Text style={styles.phaseLabel}>{currentPhase.label}</Text>
                <Text style={styles.phaseInstruction}>{currentPhase.instruction}</Text>
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>{secondsLeft}</Text>
                  <Text style={styles.timerUnit}>sec</Text>
                </View>
              </View>

              <View style={styles.controlsRow}>
                {isActive ? (
                  <TouchableOpacity
                    testID="emergency-stop-button"
                    style={styles.stopButton}
                    onPress={handleStop}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={['#FFFFFF', '#ECECEC']}
                      style={styles.stopGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <X size={22} color={Colors.danger} strokeWidth={2.5} />
                      <Text style={styles.stopText}>J’ai repris le contrôle</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    testID="emergency-start-button"
                    style={styles.startButton}
                    onPress={handleStart}
                    activeOpacity={0.92}
                  >
                    <LinearGradient
                      colors={[Colors.primary, Colors.secondary]}
                      style={styles.startGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Waves size={26} color="#0A0E27" strokeWidth={2.2} />
                      <Text style={styles.startText}>Lancer la routine</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>Actions express pour neutraliser l’envie</Text>
            <View style={styles.quickActionsGrid}>
              {QUICK_ACTIONS.map((action) => {
                const IconComponent = QUICK_ACTION_ICONS[action.id];
                return (
                  <TouchableOpacity
                    key={action.id}
                    testID={`quick-action-${action.id}`}
                    style={[styles.quickActionItem, { backgroundColor: action.primaryColor }]}
                    activeOpacity={0.88}
                    onPress={() => handleQuickActionPress(action)}
                  >
                    <View style={[styles.quickActionIconWrapper, { backgroundColor: action.accent }]}>
                      <IconComponent color="#0A0E27" size={20} />
                    </View>
                    <View style={styles.quickActionTextWrapper}>
                      <Text style={styles.quickActionTitle}>{action.title}</Text>
                      <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.tacticsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.tacticsTitle}>Protocole anti-craving</Text>
            <View style={styles.tacticsList}>
              <View style={styles.tacticRow}>
                <Wind size={20} color="#FFFFFF" strokeWidth={2.4} />
                <View style={styles.tacticTextWrapper}>
                  <Text style={styles.tacticHeadline}>3 cycles respiratoires</Text>
                  <Text style={styles.tacticDescription}>Continue jusqu’à réduire l’envie de 70 %.</Text>
                </View>
              </View>
              <View style={styles.tacticRow}>
                <Waves size={20} color="#FFFFFF" strokeWidth={2.4} />
                <View style={styles.tacticTextWrapper}>
                  <Text style={styles.tacticHeadline}>Hydratation choc</Text>
                  <Text style={styles.tacticDescription}>Bois un grand verre d’eau froide dès la fin du cycle.</Text>
                </View>
              </View>
              <View style={styles.tacticRow}>
                <ShieldCheck size={20} color="#FFFFFF" strokeWidth={2.4} />
                <View style={styles.tacticTextWrapper}>
                  <Text style={styles.tacticHeadline}>Bouclier mental</Text>
                  <Text style={styles.tacticDescription}>Relis ton top 3 des raisons de ne pas craquer.</Text>
                </View>
              </View>
              <View style={styles.tacticRow}>
                <Brain size={20} color="#FFFFFF" strokeWidth={2.4} />
                <View style={styles.tacticTextWrapper}>
                  <Text style={styles.tacticHeadline}>Micro-objectif 5 minutes</Text>
                  <Text style={styles.tacticDescription}>Fais une action focus: planifier, marcher, échanger.</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 28,
  },
  header: {
    alignItems: 'center' as const,
    gap: 12,
    marginTop: 10,
  },
  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900' as const,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.82)',
    textAlign: 'center' as const,
  },
  heroCard: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    gap: 16,
  },
  heroHeader: {
    gap: 16,
  },
  heroLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: 'rgba(255, 255, 255, 0.72)',
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
  heroStatsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: 12,
  },
  heroStat: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    gap: 6,
  },
  heroStatValue: {
    fontSize: 26,
    fontWeight: '900' as const,
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  heroMantra: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    lineHeight: 26,
  },
  breathingCard: {
    borderRadius: 32,
    backgroundColor: 'rgba(9, 5, 15, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    padding: 20,
    gap: 24,
  },
  sessionHeader: {
    gap: 4,
  },
  sessionTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  sessionSubtitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  breathingContent: {
    alignItems: 'center' as const,
    gap: 24,
    position: 'relative' as const,
  },
  waveCircle: {
    position: 'absolute' as const,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  waveCircleSecondary: {
    position: 'absolute' as const,
    width: width * 0.92,
    height: width * 0.92,
    borderRadius: width * 0.46,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  breathingGlow: {
    position: 'absolute' as const,
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: width * 0.475,
    backgroundColor: Colors.glow,
  },
  breathingCore: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    overflow: 'hidden',
  },
  breathingCoreGradient: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  phaseInfo: {
    alignItems: 'center' as const,
    gap: 10,
  },
  phaseLabel: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: '#FFFFFF',
  },
  phaseInstruction: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center' as const,
    lineHeight: 23,
  },
  timerContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    gap: 6,
  },
  timerText: {
    fontSize: 60,
    fontWeight: '900' as const,
    color: '#FFFFFF',
  },
  timerUnit: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 8,
  },
  controlsRow: {
    width: '100%',
  },
  startButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  startGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
    paddingVertical: 18,
  },
  startText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#0A0E27',
  },
  stopButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  stopGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
    paddingVertical: 18,
  },
  stopText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.danger,
  },
  quickActionsCard: {
    borderRadius: 32,
    backgroundColor: 'rgba(6, 3, 10, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    padding: 20,
    gap: 16,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  quickActionsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    justifyContent: 'space-between' as const,
  },
  quickActionItem: {
    width: '48%',
    borderRadius: 22,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickActionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  quickActionTextWrapper: {
    gap: 4,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  quickActionSubtitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tacticsCard: {
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    gap: 18,
  },
  tacticsTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  tacticsList: {
    gap: 16,
  },
  tacticRow: {
    flexDirection: 'row' as const,
    gap: 14,
    alignItems: 'center' as const,
  },
  tacticTextWrapper: {
    flex: 1,
    gap: 4,
  },
  tacticHeadline: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  tacticDescription: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.74)',
    lineHeight: 20,
  },
});