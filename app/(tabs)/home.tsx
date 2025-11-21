import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Euro, Shield, TrendingUp, Sparkles, Zap, Trophy, Target, Flame, Star, Award } from 'lucide-react-native';
import { useStats, useApp } from '../../contexts/AppContext';
import AdCarousel from '../../components/AdCarousel';
import { AD_SLOTS } from '../../constants/ad-slots';
import DailyLogModal from '../../components/DailyLogModal';
import { HEALTH_BENEFITS } from '../../constants/health-benefits';
import { DAILY_TIPS } from '../../constants/daily-tips';
import Colors from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const stats = useStats();
  const { dailyLogs, userData } = useApp();
  const [, setTick] = useState(0);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const appState = useRef(AppState.currentState);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [particles] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      anim: new Animated.Value(0),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setTick(t => t + 1);
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    particles.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 400),
          Animated.timing(particle.anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [pulseAnim, glowAnim, floatAnim, rotateAnim, particles]);

  const formatTime = () => {
    const days = Math.floor(stats.daysSinceQuit);
    const hours = Math.floor(stats.hoursSinceQuit % 24);
    const minutes = Math.floor(stats.minutesSinceQuit % 60);
    const seconds = Math.floor((stats.minutesSinceQuit * 60) % 60);

    if (days > 0) {
      return {
        value: days,
        unit: days === 1 ? 'jour' : 'jours',
        subtitle: `${hours}h ${minutes}min ${seconds}s`,
      };
    } else if (hours > 0) {
      return {
        value: hours,
        unit: hours === 1 ? 'heure' : 'heures',
        subtitle: `${minutes}min ${seconds}s`,
      };
    } else if (minutes > 0) {
      return {
        value: minutes,
        unit: minutes === 1 ? 'minute' : 'minutes',
        subtitle: `${seconds} secondes`,
      };
    } else {
      return {
        value: seconds,
        unit: seconds === 1 ? 'seconde' : 'secondes',
        subtitle: 'Chaque seconde compte !',
      };
    }
  };

  const timeDisplay = formatTime();

  const nextBenefit = HEALTH_BENEFITS.find(b => b.days > stats.daysSinceQuit);
  const latestBenefit = [...HEALTH_BENEFITS]
    .reverse()
    .find(b => b.days <= stats.daysSinceQuit);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const relapseRisk = useMemo(() => {
    return dailyLogs.slice(-3).some(log => log.count > 0);
  }, [dailyLogs]);

  const curatedSlots = useMemo(() => {
    const slots = [...AD_SLOTS];
    if (relapseRisk) {
      return [slots[2], slots[0], slots[1]].filter(Boolean);
    }
    if (stats.daysSinceQuit < 7) {
      return slots;
    }
    if (userData.consumptionType === 'joints') {
      return [slots[1], slots[0], slots[2]].filter(Boolean);
    }
    if (stats.daysSinceQuit > 30) {
      return [slots[2], slots[0], slots[1]].filter(Boolean);
    }
    return slots;
  }, [relapseRisk, stats.daysSinceQuit, userData.consumptionType]);

  console.log('[HomeScreen] curated ad slots', curatedSlots.map(slot => slot.id));

  return (
    <>
      <Stack.Screen options={{ title: 'Accueil', headerShown: false }} />
      <DailyLogModal visible={showLogModal} onClose={() => setShowLogModal(false)} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, {
            paddingBottom: Math.max(insets.bottom, 20) + 60,
          }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroContainer}>
            <View style={styles.particlesContainer}>
              {particles.map((particle) => {
                const translateY = particle.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -200],
                });
                const opacity = particle.anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 0],
                });
                const scale = particle.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5],
                });
                const angle = (particle.id / particles.length) * 360;
                const radius = 100;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <Animated.View
                    key={particle.id}
                    style={[
                      styles.particle,
                      {
                        left: width / 2 + x,
                        top: 180 + y,
                        opacity,
                        transform: [{ translateY }, { scale }],
                      },
                    ]}
                  />
                );
              })}
            </View>

            <LinearGradient
              colors={[Colors.background, Colors.backgroundLight]}
              style={styles.heroCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View
                style={[
                  styles.glowCircle,
                  {
                    opacity: glowOpacity,
                    transform: [{ rotate: spin }],
                  },
                ]}
              />

              <Animated.View style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}>
                <View style={styles.iconRing}>
                  <Flame size={48} color={Colors.primary} strokeWidth={2.5} fill={Colors.primary} />
                </View>
              </Animated.View>

              <Text style={styles.heroLabel}>TEMPS LIBRE</Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.heroValue}>{timeDisplay.value}</Text>
              </Animated.View>
              <Text style={styles.heroUnit}>{timeDisplay.unit}</Text>
              <Text style={styles.heroSubtitle}>{timeDisplay.subtitle}</Text>
              
              <View style={styles.streakRow}>
                <View style={styles.streakBadge}>
                  <Sparkles size={14} color={Colors.accent} strokeWidth={2.5} />
                  <Text style={styles.streakText}>En force!</Text>
                </View>
                <View style={[styles.streakBadge, { backgroundColor: Colors.primary + '25' }]}>
                  <Trophy size={14} color={Colors.primary} strokeWidth={2.5} />
                  <Text style={styles.streakText}>{Math.floor(stats.daysSinceQuit)}j</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <AdCarousel slots={curatedSlots} />

          <View style={styles.quickStatsContainer}>
            <LinearGradient
              colors={[Colors.success, Colors.success + 'CC']}
              style={styles.quickStatCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Shield size={28} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.quickStatValue}>{stats.consumptionAvoided}</Text>
              <Text style={styles.quickStatLabel}>Évités</Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.accent, Colors.accent + 'CC']}
              style={styles.quickStatCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Euro size={28} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.quickStatValue}>{stats.moneySaved.toFixed(0)}€</Text>
              <Text style={styles.quickStatLabel}>Économisés</Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.purple, Colors.purple + 'CC']}
              style={styles.quickStatCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Zap size={28} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
              <Text style={styles.quickStatValue}>{stats.cravingsAvoided}</Text>
              <Text style={styles.quickStatLabel}>Victoires</Text>
            </LinearGradient>
          </View>

          <View style={styles.milestoneContainer}>
            <View style={styles.milestoneHeader}>
              <Target size={20} color={Colors.primary} strokeWidth={2.5} />
              <Text style={styles.milestoneTitle}>Jalons débloqués</Text>
            </View>
            <View style={styles.milestoneGrid}>
              {[
                { days: 1, icon: Star, label: '24h', unlocked: stats.daysSinceQuit >= 1 },
                { days: 3, icon: Award, label: '3 jours', unlocked: stats.daysSinceQuit >= 3 },
                { days: 7, icon: Trophy, label: '1 sem.', unlocked: stats.daysSinceQuit >= 7 },
                { days: 30, icon: Sparkles, label: '1 mois', unlocked: stats.daysSinceQuit >= 30 },
              ].map((milestone, idx) => {
                const Icon = milestone.icon;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.milestoneBadge,
                      milestone.unlocked && styles.milestoneBadgeUnlocked,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Icon
                      size={24}
                      color={milestone.unlocked ? Colors.primary : Colors.textMuted}
                      strokeWidth={2.5}
                      fill={milestone.unlocked ? Colors.primary : 'none'}
                    />
                    <Text
                      style={[
                        styles.milestoneBadgeLabel,
                        milestone.unlocked && styles.milestoneBadgeLabelUnlocked,
                      ]}
                    >
                      {milestone.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {latestBenefit && (
            <LinearGradient
              colors={[Colors.cardBackground, Colors.cardLight]}
              style={styles.benefitCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.benefitHeader}>
                <LinearGradient
                  colors={[Colors.success, Colors.success + 'AA']}
                  style={styles.benefitIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Heart size={22} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.benefitTitle}>BIENFAIT ACTUEL</Text>
              </View>
              <Text style={styles.benefitName}>{latestBenefit.title}</Text>
              <Text style={styles.benefitDescription}>{latestBenefit.description}</Text>
            </LinearGradient>
          )}

          {nextBenefit && (
            <LinearGradient
              colors={[Colors.cardBackground, Colors.cardLight]}
              style={styles.nextBenefitCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.nextBenefitHeader}>
                <View style={styles.nextBenefitIconContainer}>
                  <TrendingUp size={20} color={Colors.blue} strokeWidth={2.5} />
                </View>
                <Text style={styles.nextBenefitLabel}>PROCHAIN BIENFAIT</Text>
              </View>
              <Text style={styles.nextBenefitTitle}>{nextBenefit.title}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.secondary]}
                    style={[
                      styles.progressFill, 
                      { width: `${Math.min(100, (stats.daysSinceQuit / nextBenefit.days) * 100)}%` }
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>
                    {Math.max(0, Math.ceil(nextBenefit.days - stats.daysSinceQuit))} {' '}
                    {Math.ceil(nextBenefit.days - stats.daysSinceQuit) <= 1 ? 'jour' : 'jours'} restants
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {Math.min(100, Math.round((stats.daysSinceQuit / nextBenefit.days) * 100))}%
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}

          <LinearGradient
            colors={[Colors.accent, Colors.orange]}
            style={styles.motivationCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Sparkles size={28} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.motivationText}>
              Chaque instant sans fumer est une victoire. Tu es plus fort·e que l&apos;envie ! 🔥
            </Text>
          </LinearGradient>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Heart size={22} color={Colors.primary} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Bénéfices santé débloqués</Text>
            </View>
            <View style={styles.benefitsTimeline}>
              {HEALTH_BENEFITS.filter(b => b.days <= stats.daysSinceQuit)
                .slice(-3)
                .map((benefit, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.timelineDot}>
                    <View style={styles.timelineDotInner} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDay}>
                      {benefit.days < 1 ? `${Math.round(benefit.days * 24)}h` : `Jour ${benefit.days}`}
                    </Text>
                    <Text style={styles.timelineTitle}>{benefit.title}</Text>
                    <Text style={styles.timelineDescription}>{benefit.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.impactGrid}>
            <LinearGradient
              colors={[Colors.purple, Colors.purple + 'DD']}
              style={styles.impactCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Heart size={32} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
              <Text style={styles.impactValue}>{Math.floor(stats.daysSinceQuit * 24)}h</Text>
              <Text style={styles.impactLabel}>Vie gagnée</Text>
            </LinearGradient>

            <LinearGradient
              colors={[Colors.blue, Colors.blue + 'DD']}
              style={styles.impactCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TrendingUp size={32} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.impactValue}>
                {Math.min(100, Math.round((stats.daysSinceQuit / 30) * 30))}%
              </Text>
              <Text style={styles.impactLabel}>Poumons</Text>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={[Colors.cardBackground, Colors.cardLight]}
            style={styles.comparisonCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.comparisonTitle}>Avec {stats.moneySaved.toFixed(0)}€ économisés, tu peux :</Text>
            <View style={styles.comparisonList}>
              {[
                { emoji: '🎮', text: 'Un nouveau jeu vidéo', amount: 60 },
                { emoji: '🍕', text: `${Math.floor(stats.moneySaved / 12)} pizzas`, amount: 12 },
                { emoji: '🎬', text: `${Math.floor(stats.moneySaved / 10)} sorties ciné`, amount: 10 },
                { emoji: '☕', text: `${Math.floor(stats.moneySaved / 3)} cafés`, amount: 3 },
              ].filter(item => stats.moneySaved >= item.amount).slice(0, 3).map((item, idx) => (
                <View key={idx} style={styles.comparisonItem}>
                  <Text style={styles.comparisonEmoji}>{item.emoji}</Text>
                  <Text style={styles.comparisonText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          <LinearGradient
            colors={[Colors.accent, Colors.orange]}
            style={styles.dailyTipCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.dailyTipHeader}>
              <View style={styles.dailyTipDay}>
                <Text style={styles.dailyTipDayText}>Jour {Math.min(30, Math.ceil(stats.daysSinceQuit))}</Text>
              </View>
              <Sparkles size={24} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.dailyTipTitle}>
              {DAILY_TIPS[Math.min(29, Math.floor(stats.daysSinceQuit))]?.title || 'Continue comme ça !'}
            </Text>
            <Text style={styles.dailyTipContent}>
              {DAILY_TIPS[Math.min(29, Math.floor(stats.daysSinceQuit))]?.content || 'Tu es au-delà des 30 premiers jours ! Continue ton excellent travail !'}
            </Text>
          </LinearGradient>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  heroContainer: {
    marginBottom: 24,
    position: 'relative' as const,
  },
  particlesContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle: {
    position: 'absolute' as const,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  heroCard: {
    borderRadius: 32,
    padding: 40,
    alignItems: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  glowCircle: {
    position: 'absolute' as const,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.glow,
    top: '50%',
    left: '50%',
    marginLeft: -150,
    marginTop: -150,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary + '20',
    borderWidth: 3,
    borderColor: Colors.primary + '40',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  heroLabel: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '700' as const,
    marginBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  heroValue: {
    fontSize: 80,
    fontWeight: '900' as const,
    color: Colors.text,
    lineHeight: 88,
  },
  heroUnit: {
    fontSize: 26,
    color: Colors.textLight,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  streakRow: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 24,
  },
  streakBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: Colors.accent + '25',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  streakText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  quickStatsContainer: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 24,
  },
  quickStatCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center' as const,
    gap: 8,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: '#FFFFFF',
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  milestoneContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 16,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  milestoneGrid: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  milestoneBadge: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneBadgeUnlocked: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary + '40',
  },
  milestoneBadgeLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textMuted,
  },
  milestoneBadgeLabelUnlocked: {
    color: Colors.primary,
  },
  benefitCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 16,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  benefitName: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 23,
  },
  nextBenefitCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextBenefitHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 12,
  },
  nextBenefitIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  nextBenefitLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  nextBenefitTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 20,
  },
  progressContainer: {
    gap: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressTextContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '700' as const,
  },
  progressPercentage: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '800' as const,
  },
  motivationCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center' as const,
    gap: 12,
  },
  motivationText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    lineHeight: 26,
    textAlign: 'center' as const,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  benefitsTimeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row' as const,
    gap: 16,
    paddingLeft: 8,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '30',
    borderWidth: 3,
    borderColor: Colors.primary,
    marginTop: 4,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
    marginLeft: -13,
    paddingLeft: 28,
  },
  timelineDay: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.primary,
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  impactGrid: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 20,
  },
  impactCard: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center' as const,
    gap: 12,
  },
  impactValue: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: '#FFFFFF',
  },
  impactLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textTransform: 'uppercase' as const,
    opacity: 0.9,
  },
  comparisonCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 20,
  },
  comparisonList: {
    gap: 16,
  },
  comparisonItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 16,
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 16,
  },
  comparisonEmoji: {
    fontSize: 28,
  },
  comparisonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  quickTipsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickTipsHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 12,
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  quickTipsText: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 23,
    fontWeight: '600' as const,
  },
  dailyTipCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    gap: 16,
  },
  dailyTipHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  dailyTipDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dailyTipDayText: {
    fontSize: 13,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  dailyTipTitle: {
    fontSize: 22,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  dailyTipContent: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600' as const,
    lineHeight: 24,
    opacity: 0.95,
  },
});
