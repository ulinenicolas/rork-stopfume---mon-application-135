import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BookOpen, Target, Heart, Brain, Sparkles, ChevronLeft, ChevronRight,
  CheckCircle2, Calendar, Trophy, Zap, Star, Crown
} from 'lucide-react-native';
import { useStats } from '../../contexts/AppContext';
import { PROGRAM_30_DAYS } from '../../constants/30-day-program';
import Colors from '../../constants/colors';



export default function ProgramScreen() {
  const insets = useSafeAreaInsets();
  const stats = useStats();
  const currentDayNumber = Math.min(30, Math.max(1, Math.ceil(stats.daysSinceQuit)));
  const [selectedDay, setSelectedDay] = useState(currentDayNumber);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const selectedProgram = PROGRAM_30_DAYS[selectedDay - 1];
  const isCurrentDay = selectedDay === currentDayNumber;
  const isPastDay = selectedDay < currentDayNumber;
  const isFutureDay = selectedDay > currentDayNumber;
  const isLocked = selectedProgram.isPremium;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedDay, fadeAnim, slideAnim]);

  const handleDayChange = (direction: 'prev' | 'next') => {
    const newDay = direction === 'prev' ? selectedDay - 1 : selectedDay + 1;
    if (newDay >= 1 && newDay <= 30) {
      fadeAnim.setValue(0);
      slideAnim.setValue(direction === 'prev' ? -20 : 20);
      setSelectedDay(newDay);
    }
  };

  const DaySelector = () => (
    <View style={styles.daySelectorContainer}>
      <TouchableOpacity
        onPress={() => handleDayChange('prev')}
        disabled={selectedDay === 1}
        style={[styles.dayButton, selectedDay === 1 && styles.dayButtonDisabled]}
      >
        <ChevronLeft size={24} color={selectedDay === 1 ? Colors.textMuted : Colors.text} strokeWidth={2.5} />
      </TouchableOpacity>

      <View style={styles.dayInfo}>
        <Text style={styles.dayLabel}>JOUR</Text>
        <Text style={styles.dayNumber}>{selectedDay}</Text>
        <View style={styles.dayBadgeRow}>
          {isCurrentDay && (
            <View style={[styles.dayBadge, { backgroundColor: Colors.primary + '20' }]}>
              <Zap size={12} color={Colors.primary} strokeWidth={2.5} fill={Colors.primary} />
              <Text style={[styles.dayBadgeText, { color: Colors.primary }]}>Aujourd&apos;hui</Text>
            </View>
          )}
          {isPastDay && (
            <View style={[styles.dayBadge, { backgroundColor: Colors.success + '20' }]}>
              <CheckCircle2 size={12} color={Colors.success} strokeWidth={2.5} />
              <Text style={[styles.dayBadgeText, { color: Colors.success }]}>Terminé</Text>
            </View>
          )}
          {isFutureDay && (
            <View style={[styles.dayBadge, { backgroundColor: Colors.blue + '20' }]}>
              <Calendar size={12} color={Colors.blue} strokeWidth={2.5} />
              <Text style={[styles.dayBadgeText, { color: Colors.blue }]}>À venir</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleDayChange('next')}
        disabled={selectedDay === 30}
        style={[styles.dayButton, selectedDay === 30 && styles.dayButtonDisabled]}
      >
        <ChevronRight size={24} color={selectedDay === 30 ? Colors.textMuted : Colors.text} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );

  const ProgramCard = ({ 
    icon: Icon, 
    title, 
    content, 
    gradient, 
    iconColor 
  }: { 
    icon: any; 
    title: string; 
    content: string; 
    gradient: string[]; 
    iconColor: string;
  }) => (
    <LinearGradient
      colors={[Colors.cardBackground, Colors.cardLight]}
      style={styles.programCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.programCardHeader}>
        <LinearGradient
          colors={gradient}
          style={styles.programIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon size={22} color={iconColor} strokeWidth={2.5} />
        </LinearGradient>
        <Text style={styles.programCardTitle}>{title}</Text>
      </View>
      <Text style={styles.programCardContent}>{content}</Text>
    </LinearGradient>
  );

  const LockedOverlay = () => (
    <View style={styles.lockedOverlay}>
      <LinearGradient
        colors={[Colors.background + 'F0', Colors.background + 'F8']}
        style={styles.lockedContent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={[Colors.accent, Colors.orange]}
          style={styles.lockedIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Crown size={32} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.lockedTitle}>Contenu Premium</Text>
        <Text style={styles.lockedDescription}>
          Débloque le programme complet pour accéder aux défis avancés, conseils santé exclusifs et exercices mentaux guidés
        </Text>
        <TouchableOpacity style={styles.unlockButton} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.accent, Colors.orange]}
            style={styles.unlockButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Crown size={20} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
            <Text style={styles.unlockButtonText}>Passer à Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Programme 30 Jours', headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, {
            paddingBottom: Math.max(insets.bottom, 20) + 60,
          }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={[Colors.accent, Colors.orange]}
              style={styles.headerIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <BookOpen size={32} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Programme 30 Jours</Text>
              <Text style={styles.headerSubtitle}>Ton guide quotidien vers la liberté</Text>
            </View>
          </View>

          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.progressCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.progressHeader}>
              <Trophy size={24} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.progressTitle}>Ton Avancement</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(currentDayNumber / 30) * 100}%` }]} />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>{currentDayNumber} / 30 jours</Text>
                <Text style={styles.progressPercentage}>{Math.round((currentDayNumber / 30) * 100)}%</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.statText}>{currentDayNumber} complété{currentDayNumber > 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.statItem}>
                <Star size={16} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                <Text style={styles.statText}>{30 - currentDayNumber} restant{(30 - currentDayNumber) > 1 ? 's' : ''}</Text>
              </View>
            </View>
          </LinearGradient>

          <DaySelector />

          <Animated.View 
            style={[
              styles.programContent,
              { 
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            {isLocked && <LockedOverlay />}

            <ProgramCard
              icon={Target}
              title="🎯 Défi du jour"
              content={selectedProgram.challenge}
              gradient={[Colors.primary, Colors.secondary]}
              iconColor="#FFFFFF"
            />

            <ProgramCard
              icon={Heart}
              title="💚 Conseil Santé"
              content={selectedProgram.healthTip}
              gradient={[Colors.success, Colors.success + 'CC']}
              iconColor="#FFFFFF"
            />

            <ProgramCard
              icon={Brain}
              title="🧠 Exercice Mental"
              content={selectedProgram.mentalExercise}
              gradient={[Colors.purple, Colors.purple + 'CC']}
              iconColor="#FFFFFF"
            />

            <LinearGradient
              colors={[Colors.accent, Colors.orange]}
              style={styles.motivationCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Sparkles size={32} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.motivationTitle}>Message du jour</Text>
              <Text style={styles.motivationText}>{selectedProgram.motivationalMessage}</Text>
            </LinearGradient>

            {isCurrentDay && (
              <TouchableOpacity style={styles.completeButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={[Colors.success, Colors.success + 'CC']}
                  style={styles.completeButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <CheckCircle2 size={24} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.completeButtonText}>Marquer comme terminé</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View style={styles.navigationHint}>
              <ChevronLeft size={16} color={Colors.textMuted} strokeWidth={2} />
              <Text style={styles.navigationText}>Swipe ou utilise les flèches pour naviguer</Text>
              <ChevronRight size={16} color={Colors.textMuted} strokeWidth={2} />
            </View>
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
    fontSize: 28,
    fontWeight: '900' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  progressCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    gap: 16,
  },
  progressHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  progressBarContainer: {
    gap: 12,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  progressInfo: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    opacity: 0.9,
  },
  progressPercentage: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800' as const,
  },
  statsRow: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  statText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600' as const,
    opacity: 0.9,
  },
  daySelectorContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 24,
    marginBottom: 24,
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dayButtonDisabled: {
    opacity: 0.3,
  },
  dayInfo: {
    alignItems: 'center' as const,
    gap: 8,
    minWidth: 120,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  dayNumber: {
    fontSize: 48,
    fontWeight: '900' as const,
    color: Colors.text,
    lineHeight: 52,
  },
  dayBadgeRow: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  dayBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  programContent: {
    gap: 16,
    position: 'relative' as const,
  },
  programCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  programCardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  programIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  programCardTitle: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
    flex: 1,
  },
  programCardContent: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  motivationCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center' as const,
    gap: 12,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  motivationText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600' as const,
    lineHeight: 26,
    textAlign: 'center' as const,
  },
  completeButton: {
    marginTop: 8,
  },
  completeButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
    padding: 20,
    borderRadius: 20,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  navigationHint: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
  },
  navigationText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  lockedOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    borderRadius: 24,
    overflow: 'hidden',
  },
  lockedContent: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 32,
    gap: 20,
  },
  lockedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: Colors.text,
  },
  lockedDescription: {
    fontSize: 15,
    color: Colors.textLight,
    textAlign: 'center' as const,
    lineHeight: 24,
    maxWidth: 300,
  },
  unlockButton: {
    marginTop: 8,
  },
  unlockButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
});
