import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Award, Target, BarChart3, Trophy, Zap, Euro, Shield, Clock, Heart } from 'lucide-react-native';
import { useStats, useAchievements } from '../../contexts/AppContext';
import Colors from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const stats = useStats();
  const achievements = useAchievements();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  const getWeekData = () => {
    const days = Math.floor(stats.daysSinceQuit);
    return Array.from({ length: 7 }, (_, i) => {
      const dayNum = Math.max(0, days - (6 - i));
      return {
        day: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][(new Date().getDay() - (6 - i) + 7) % 7],
        value: dayNum > 0 ? 1 : 0,
        label: dayNum > 0 ? '✓' : '',
      };
    });
  };

  const weekData = getWeekData();

  return (
    <>
      <Stack.Screen options={{ title: 'Statistiques', headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, {
            paddingBottom: Math.max(insets.bottom, 20) + 60,
          }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.header}>
              <LinearGradient
                colors={[Colors.blue, Colors.purple]}
                style={styles.headerIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <BarChart3 size={32} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>
              <View>
                <Text style={styles.headerTitle}>Tes Stats</Text>
                <Text style={styles.headerSubtitle}>Performance en temps réel</Text>
              </View>
            </View>

            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.heroStatCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Clock size={36} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.heroStatValue}>{Math.floor(stats.daysSinceQuit)}</Text>
              <Text style={styles.heroStatLabel}>JOURS SANS FUMER</Text>
              <View style={styles.heroStatDivider} />
              <Text style={styles.heroStatSubtext}>
                {Math.floor(stats.hoursSinceQuit)} heures · {Math.floor(stats.minutesSinceQuit)} minutes
              </Text>
            </LinearGradient>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>Progrès de la semaine</Text>
              </View>
              
              <LinearGradient
                colors={[Colors.cardBackground, Colors.cardLight]}
                style={styles.chartCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.chartContainer}>
                  {weekData.map((data, index) => {
                    const maxHeight = 120;
                    const height = data.value * maxHeight;
                    return (
                      <View key={index} style={styles.chartBarContainer}>
                        <View style={styles.chartBarWrapper}>
                          <View style={[styles.chartBarBg, { height: maxHeight }]}>
                            {data.value > 0 && (
                              <LinearGradient
                                colors={[Colors.primary, Colors.secondary]}
                                style={[styles.chartBar, { height }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                              >
                                <Text style={styles.chartBarLabel}>{data.label}</Text>
                              </LinearGradient>
                            )}
                          </View>
                        </View>
                        <Text style={styles.chartDayLabel}>{data.day}</Text>
                      </View>
                    );
                  })}
                </View>
              </LinearGradient>
            </View>

            <View style={styles.statsGrid}>
              <LinearGradient
                colors={[Colors.cardBackground, Colors.cardLight]}
                style={styles.statCardLarge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.statCardIcon}>
                  <Shield size={28} color={Colors.success} strokeWidth={2.5} />
                </View>
                <Text style={styles.statCardValue}>{stats.consumptionAvoided}</Text>
                <Text style={styles.statCardLabel}>Évités au total</Text>
              </LinearGradient>

              <LinearGradient
                colors={[Colors.cardBackground, Colors.cardLight]}
                style={styles.statCardLarge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.statCardIcon}>
                  <Euro size={28} color={Colors.accent} strokeWidth={2.5} />
                </View>
                <Text style={styles.statCardValue}>{stats.moneySaved.toFixed(0)}€</Text>
                <Text style={styles.statCardLabel}>Économisés</Text>
              </LinearGradient>

              <LinearGradient
                colors={[Colors.cardBackground, Colors.cardLight]}
                style={styles.statCardLarge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.statCardIcon}>
                  <Zap size={28} color={Colors.purple} strokeWidth={2.5} />
                </View>
                <Text style={styles.statCardValue}>{stats.cravingsAvoided}</Text>
                <Text style={styles.statCardLabel}>Envies vaincues</Text>
              </LinearGradient>

              <LinearGradient
                colors={[Colors.cardBackground, Colors.cardLight]}
                style={styles.statCardLarge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.statCardIcon}>
                  <Heart size={28} color={Colors.danger} strokeWidth={2.5} />
                </View>
                <Text style={styles.statCardValue}>{stats.totalCravings}</Text>
                <Text style={styles.statCardLabel}>Envies totales</Text>
              </LinearGradient>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Award size={20} color={Colors.accent} strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>Réalisations débloquées</Text>
              </View>

              <View style={styles.achievementsContainer}>
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.map((achievement) => (
                    <LinearGradient
                      key={achievement.id}
                      colors={[Colors.cardBackground, Colors.cardLight]}
                      style={styles.achievementCard}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <LinearGradient
                        colors={[Colors.accent, Colors.orange]}
                        style={styles.achievementIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Trophy size={28} color="#FFFFFF" strokeWidth={2.5} />
                      </LinearGradient>
                      <View style={styles.achievementContent}>
                        <Text style={styles.achievementTitle}>{achievement.title}</Text>
                        <Text style={styles.achievementDescription}>{achievement.description}</Text>
                      </View>
                    </LinearGradient>
                  ))
                ) : (
                  <LinearGradient
                    colors={[Colors.cardBackground, Colors.cardLight]}
                    style={styles.emptyCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Trophy size={32} color={Colors.textMuted} strokeWidth={2} />
                    <Text style={styles.emptyText}>Continue pour débloquer des réalisations !</Text>
                  </LinearGradient>
                )}
              </View>
            </View>

            {nextAchievement && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Target size={20} color={Colors.primary} strokeWidth={2.5} />
                  <Text style={styles.sectionTitle}>Prochain objectif</Text>
                </View>

                <LinearGradient
                  colors={[Colors.cardBackground, Colors.cardLight]}
                  style={styles.nextGoalCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.nextGoalHeader}>
                    <View style={styles.nextGoalIcon}>
                      <Target size={24} color={Colors.primary} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.nextGoalTitle}>{nextAchievement.title}</Text>
                  </View>
                  <Text style={styles.nextGoalDescription}>
                    {nextAchievement.description}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={[Colors.primary, Colors.secondary]}
                        style={[
                          styles.progressFill,
                          { width: `${Math.min(100, (stats.daysSinceQuit / nextAchievement.daysRequired) * 100)}%` }
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressText}>
                        {Math.max(0, Math.ceil(nextAchievement.daysRequired - stats.daysSinceQuit))} jours restants
                      </Text>
                      <Text style={styles.progressPercentage}>
                        {Math.min(100, Math.round((stats.daysSinceQuit / nextAchievement.daysRequired) * 100))}%
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}
          </Animated.View>
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
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 16,
    marginBottom: 24,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  heroStatCard: {
    borderRadius: 32,
    padding: 32,
    alignItems: 'center' as const,
    marginBottom: 32,
    gap: 12,
  },
  heroStatValue: {
    fontSize: 72,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    lineHeight: 80,
  },
  heroStatLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    opacity: 0.9,
  },
  heroStatDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },
  heroStatSubtext: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600' as const,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
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
  chartCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center' as const,
    gap: 12,
  },
  chartBarWrapper: {
    width: '100%',
    alignItems: 'center' as const,
  },
  chartBarBg: {
    width: '100%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    justifyContent: 'flex-end' as const,
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  chartBarLabel: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  chartDayLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 32,
  },
  statCardLarge: {
    width: (width - 52) / 2,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center' as const,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: Colors.text,
  },
  statCardLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row' as const,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center' as const,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  achievementContent: {
    flex: 1,
    gap: 4,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  emptyCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center' as const,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  nextGoalCard: {
    borderRadius: 24,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextGoalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  nextGoalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  nextGoalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  nextGoalDescription: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 22,
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
  progressInfo: {
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
});
