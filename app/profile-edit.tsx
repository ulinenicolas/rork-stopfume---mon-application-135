import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Save, Calendar, DollarSign, Cigarette } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import Colors from '../constants/colors';

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const { userData, updateUserData } = useApp();
  
  const [consumptionType, setConsumptionType] = useState<string>(userData.consumptionType);
  const [dailyConsumption, setDailyConsumption] = useState<string>(userData.dailyConsumption.toString());
  const [costPerUnit, setCostPerUnit] = useState<string>(userData.costPerUnit.toString());
  const [quitDate, setQuitDate] = useState<string>(
    new Date(userData.quitDate).toISOString().split('T')[0]
  );

  const CONSUMPTION_TYPES = [
    { id: 'cigarettes', label: 'Cigarettes', emoji: '🚬' },
    { id: 'joints', label: 'Joints', emoji: '🌿' },
    { id: 'thc', label: 'THC', emoji: '💨' },
    { id: 'nicotine', label: 'Nicotine', emoji: '⚡' },
  ];

  const handleSave = () => {
    const consumption = parseFloat(dailyConsumption);
    const cost = parseFloat(costPerUnit);

    if (isNaN(consumption) || consumption <= 0) {
      Alert.alert('Erreur', 'Entre une consommation quotidienne valide');
      return;
    }

    if (isNaN(cost) || cost <= 0) {
      Alert.alert('Erreur', 'Entre un coût unitaire valide');
      return;
    }

    const newQuitDate = new Date(quitDate).toISOString();

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    updateUserData({
      consumptionType: consumptionType as any,
      dailyConsumption: consumption,
      costPerUnit: cost,
      quitDate: newQuitDate,
    });

    Alert.alert('Profil mis à jour !', 'Tes informations ont été sauvegardées', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Modifier le profil',
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={{ marginRight: 8 }}>
              <Save size={24} color={Colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={[styles.container]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, {
            paddingBottom: Math.max(insets.bottom, 20) + 60,
          }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type de consommation</Text>
            <View style={styles.typesGrid}>
              {CONSUMPTION_TYPES.map((type) => {
                const isSelected = consumptionType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      isSelected && styles.typeCardSelected,
                    ]}
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setConsumptionType(type.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.typeEmoji}>{type.emoji}</Text>
                    <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <LinearGradient
            colors={[Colors.cardBackground, Colors.cardLight]}
            style={styles.formCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <Cigarette size={20} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.inputLabel}>Consommation quotidienne</Text>
              </View>
              <TextInput
                style={styles.input}
                value={dailyConsumption}
                onChangeText={setDailyConsumption}
                placeholder="20"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <DollarSign size={20} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.inputLabel}>Coût unitaire (€)</Text>
              </View>
              <TextInput
                style={styles.input}
                value={costPerUnit}
                onChangeText={setCostPerUnit}
                placeholder="0.50"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <Calendar size={20} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.inputLabel}>Date d&apos;arrêt</Text>
              </View>
              <TextInput
                style={styles.input}
                value={quitDate}
                onChangeText={setQuitDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textMuted}
              />
              <Text style={styles.inputHint}>Format: AAAA-MM-JJ</Text>
            </View>
          </LinearGradient>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Save size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  typesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  typeCard: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center' as const,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  typeEmoji: {
    fontSize: 32,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textLight,
  },
  typeLabelSelected: {
    color: Colors.primary,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputGroup: {
    gap: 12,
  },
  inputHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  inputHint: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  saveButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
    paddingVertical: 18,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
});
