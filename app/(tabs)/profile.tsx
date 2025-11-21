import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Trash2, Info, Calendar, DollarSign, Cigarette, Flame, Edit } from 'lucide-react-native';
import { useApp, useStats } from '../../contexts/AppContext';
import Colors from '../../constants/colors';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userData, resetData } = useApp();
  const stats = useStats();

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser les données',
      'Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => resetData(),
        },
      ]
    );
  };

  const CONSUMPTION_TYPE_LABELS: Record<string, string> = {
    cigarettes: 'Cigarettes',
    joints: 'Joints',
    thc: 'THC',
    nicotine: 'Nicotine',
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Profil', headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, {
            paddingBottom: Math.max(insets.bottom, 20) + 60,
          }]}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
              style={styles.avatarContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <User size={48} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
            <Text style={styles.heroTitle}>Ton Parcours</Text>
            <View style={styles.heroBadge}>
              <Flame size={16} color={Colors.accent} strokeWidth={2.5} fill={Colors.accent} />
              <Text style={styles.heroBadgeText}>
                {Math.floor(stats.daysSinceQuit)} {Math.floor(stats.daysSinceQuit) <= 1 ? 'jour' : 'jours'} libre
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Settings size={20} color={Colors.primary} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Tes Infos</Text>
            </View>

            <LinearGradient
              colors={[Colors.cardBackground, Colors.cardLight]}
              style={styles.infoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Cigarette size={20} color={Colors.textLight} strokeWidth={2.5} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Type de consommation</Text>
                  <Text style={styles.infoValue}>
                    {CONSUMPTION_TYPE_LABELS[userData.consumptionType]}
                  </Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <BarChart size={20} color={Colors.textLight} strokeWidth={2.5} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Consommation quotidienne</Text>
                  <Text style={styles.infoValue}>{userData.dailyConsumption} / jour</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <DollarSign size={20} color={Colors.textLight} strokeWidth={2.5} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Coût unitaire</Text>
                  <Text style={styles.infoValue}>{userData.costPerUnit.toFixed(2)} €</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Calendar size={20} color={Colors.textLight} strokeWidth={2.5} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date d&apos;arrêt</Text>
                  <Text style={styles.infoValue}>
                    {new Date(userData.quitDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile-edit')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.editButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Edit size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.editButtonText}>Modifier mon profil</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color={Colors.blue} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>À propos</Text>
            </View>

            <LinearGradient
              colors={[Colors.cardBackground, Colors.cardLight]}
              style={styles.aboutCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.aboutText}>
                Cette app t&apos;aide à tracker ton parcours pour arrêter de fumer. 
                Continue d&apos;utiliser les outils pour rester motivé·e ! 💪
              </Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.cardBackground, Colors.cardLight]}
              style={styles.dangerButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.dangerIconContainer}>
                <Trash2 size={20} color={Colors.danger} strokeWidth={2.5} />
              </View>
              <Text style={styles.dangerButtonText}>Réinitialiser les données</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const BarChart = ({ size, color, strokeWidth }: { size: number; color: string; strokeWidth: number }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
      <View style={{ width: 3, height: 8, backgroundColor: color, borderRadius: 1.5 }} />
      <View style={{ width: 3, height: 12, backgroundColor: color, borderRadius: 1.5 }} />
      <View style={{ width: 3, height: 6, backgroundColor: color, borderRadius: 1.5 }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  heroCard: {
    borderRadius: 32,
    padding: 32,
    alignItems: 'center' as const,
    gap: 16,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: '#FFFFFF',
  },
  heroBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  heroBadgeText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700' as const,
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
  infoCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 16,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '800' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  aboutCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  aboutText: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 23,
    fontWeight: '500' as const,
  },
  versionBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start' as const,
  },
  versionText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '700' as const,
  },
  editButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  editButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
    paddingVertical: 18,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  dangerButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 16,
  },
  dangerButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.danger,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  dangerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.danger + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.danger,
  },
});
