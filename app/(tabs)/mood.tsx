import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Smile, Meh, Frown, Heart, Calendar } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { MoodEntry } from '../../types/app';
import Colors from '../../constants/colors';

const MOODS = [
  { id: 'excellent' as const, label: 'Excellent', icon: Smile, color: Colors.success, emoji: '😊' },
  { id: 'good' as const, label: 'Bien', icon: Smile, color: Colors.blue, emoji: '🙂' },
  { id: 'okay' as const, label: 'Moyen', icon: Meh, color: Colors.accent, emoji: '😐' },
  { id: 'difficult' as const, label: 'Difficile', icon: Frown, color: Colors.orange, emoji: '😟' },
  { id: 'struggling' as const, label: 'En difficulté', icon: Frown, color: Colors.danger, emoji: '😢' },
];

export default function MoodScreen() {
  const insets = useSafeAreaInsets();
  const { moods, addMood } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [note, setNote] = useState<string>('');

  const handleSaveMood = () => {
    if (!selectedMood) {
      Alert.alert('Sélectionne ton humeur', 'Choisis comment tu te sens aujourd&apos;hui');
      return;
    }

    addMood({
      mood: selectedMood,
      note: note.trim() || undefined,
    });

    setSelectedMood(null);
    setNote('');
    Alert.alert('Humeur enregistrée !', 'Continue comme ça, tu gères ! 💪');
  };

  const sortedMoods = [...moods].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Humeur', headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, {
            paddingBottom: Math.max(insets.bottom, 20) + 60,
          }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={[Colors.purple, Colors.primary]}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Heart size={28} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Comment vas-tu ?</Text>
              <Text style={styles.headerSubtitle}>Suivi de ton humeur</Text>
            </View>
          </View>

          <LinearGradient
            colors={[Colors.cardBackground, Colors.cardLight]}
            style={styles.addCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.addCardTitle}>Aujourd&apos;hui je me sens...</Text>
            
            <View style={styles.moodsGrid}>
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodButton,
                      isSelected && { borderColor: mood.color, backgroundColor: mood.color + '20' }
                    ]}
                    onPress={() => setSelectedMood(mood.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[styles.moodLabel, isSelected && { color: mood.color }]}>
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Note (optionnelle)</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Comment te sens-tu ? Qu&apos;est-ce qui t&apos;aide ?"
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveMood}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Enregistrer mon humeur</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={Colors.primary} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Historique</Text>
            </View>

            {sortedMoods.length === 0 ? (
              <LinearGradient
                colors={[Colors.cardBackground, Colors.cardLight]}
                style={styles.emptyCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Heart size={32} color={Colors.textMuted} strokeWidth={2} />
                <Text style={styles.emptyText}>
                  Commence à tracker ton humeur pour voir ton évolution
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.historyList}>
                {sortedMoods.slice(0, 10).map((moodEntry) => {
                  const moodConfig = MOODS.find(m => m.id === moodEntry.mood);
                  if (!moodConfig) return null;
                  
                  const date = new Date(moodEntry.timestamp);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <LinearGradient
                      key={moodEntry.id}
                      colors={[Colors.cardBackground, Colors.cardLight]}
                      style={styles.historyCard}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={[styles.moodIndicator, { backgroundColor: moodConfig.color }]} />
                      <View style={styles.historyContent}>
                        <View style={styles.historyHeader}>
                          <Text style={styles.historyMood}>
                            {moodConfig.emoji} {moodConfig.label}
                          </Text>
                          <Text style={styles.historyTime}>
                            {isToday ? "Aujourd&apos;hui" : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </Text>
                        </View>
                        {moodEntry.note && (
                          <Text style={styles.historyNote}>{moodEntry.note}</Text>
                        )}
                      </View>
                    </LinearGradient>
                  );
                })}
              </View>
            )}
          </View>
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
  headerIcon: {
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
  addCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addCardTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 20,
  },
  moodsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 24,
  },
  moodButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 4,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.textLight,
    textAlign: 'center' as const,
  },
  noteContainer: {
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  noteInput: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 100,
    fontWeight: '500' as const,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
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
    lineHeight: 22,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row' as const,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodIndicator: {
    width: 4,
    borderRadius: 2,
  },
  historyContent: {
    flex: 1,
    gap: 8,
  },
  historyHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  historyTime: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  historyNote: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
});
