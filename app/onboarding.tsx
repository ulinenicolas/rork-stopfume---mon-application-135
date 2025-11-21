import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Cigarette, Leaf, Heart } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { ConsumptionType } from '../types/app';
import Colors from '../constants/colors';

const CONSUMPTION_TYPES = [
  { id: 'cigarettes' as ConsumptionType, label: 'Cigarettes', icon: Cigarette },
  { id: 'joints' as ConsumptionType, label: 'Joints', icon: Leaf },
  { id: 'thc' as ConsumptionType, label: 'THC', icon: Leaf },
  { id: 'nicotine' as ConsumptionType, label: 'Nicotine', icon: Heart },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateUserData } = useApp();
  
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<number>(1);
  const [consumptionType, setConsumptionType] = useState<ConsumptionType>('cigarettes');
  const [dailyConsumption, setDailyConsumption] = useState<string>('20');
  const [costPerUnit, setCostPerUnit] = useState<string>('0.5');
  const [dailyConsumptionError, setDailyConsumptionError] = useState<string>('');
  const [costPerUnitError, setCostPerUnitError] = useState<string>('');
  const quitDate = new Date();

  const sanitizeNumericInput = (value: string, allowDecimal: boolean) => {
    const normalized = value.replace(',', '.');
    const filtered = normalized.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, '');
    if (!allowDecimal) {
      return filtered;
    }
    const parts = filtered.split('.');
    if (parts.length <= 2) {
      return filtered;
    }
    return `${parts[0]}.${parts.slice(1).join('')}`;
  };

  const handleDailyChange = (text: string) => {
    const sanitized = sanitizeNumericInput(text, false);
    setDailyConsumption(sanitized);
    if (dailyConsumptionError) {
      setDailyConsumptionError('');
    }
  };

  const handleCostChange = (text: string) => {
    const sanitized = sanitizeNumericInput(text, true);
    setCostPerUnit(sanitized);
    if (costPerUnitError) {
      setCostPerUnitError('');
    }
  };

  const consumptionValue = useMemo(() => Number(dailyConsumption || 0), [dailyConsumption]);
  const costValue = useMemo(() => Number(costPerUnit || 0), [costPerUnit]);
  const canAdvanceStep2 = consumptionValue > 0 && costValue > 0;
  const projectedDailyCost = useMemo(() => {
    if (!canAdvanceStep2) {
      return '0.00';
    }
    const total = costValue * consumptionValue;
    return Number.isFinite(total) ? total.toFixed(2) : '0.00';
  }, [canAdvanceStep2, costValue, consumptionValue]);

  const handleComplete = () => {
    updateUserData({
      consumptionType,
      dailyConsumption: consumptionValue > 0 ? consumptionValue : 20,
      costPerUnit: costValue > 0 ? costValue : 0.5,
      quitDate: quitDate.toISOString(),
      isOnboarded: true,
    });
    router.replace('/(tabs)/home');
  };

  const handleStep2Continue = () => {
    let hasError = false;

    if (consumptionValue <= 0) {
      setDailyConsumptionError('Entrez une valeur positive');
      hasError = true;
    }

    if (costValue <= 0) {
      setCostPerUnitError('Entrez un coût valide');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setStep(3);
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Que souhaitez-vous arrêter ?</Text>
      <Text style={styles.subtitle}>Sélectionnez votre type de consommation</Text>
      
      <View style={styles.optionsGrid}>
        {CONSUMPTION_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = consumptionType === type.id;
          
          return (
            <TouchableOpacity
              key={type.id}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => setConsumptionType(type.id)}
              activeOpacity={0.7}
            >
              <Icon 
                size={32} 
                color={isSelected ? Colors.primary : Colors.textLight} 
                strokeWidth={2}
              />
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => setStep(2)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Votre consommation</Text>
      <Text style={styles.subtitle}>Aidez-nous à calculer vos économies</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Consommation quotidienne</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            testID="daily-consumption-input"
            style={styles.input}
            value={dailyConsumption}
            onChangeText={handleDailyChange}
            keyboardType="numeric"
            placeholder="20"
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.inputUnit}>par jour</Text>
        </View>
        {dailyConsumptionError ? (
          <Text style={styles.errorText}>{dailyConsumptionError}</Text>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Coût unitaire (€)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            testID="unit-cost-input"
            style={styles.input}
            value={costPerUnit}
            onChangeText={handleCostChange}
            keyboardType="decimal-pad"
            placeholder="0.50"
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.inputUnit}>€</Text>
        </View>
        {costPerUnitError ? (
          <Text style={styles.errorText}>{costPerUnitError}</Text>
        ) : null}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          testID="step-two-back"
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => setStep(1)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonSecondaryText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          testID="step-two-continue"
          style={[styles.button, styles.buttonPrimary, !canAdvanceStep2 && styles.buttonDisabled]}
          onPress={handleStep2Continue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Continuer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Félicitations !</Text>
      <Text style={styles.subtitle}>Vous êtes prêt à commencer votre voyage vers une vie sans tabac</Text>

      <View style={styles.summaryCard} testID="onboarding-summary">
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Type</Text>
          <Text style={styles.summaryValue}>
            {CONSUMPTION_TYPES.find(t => t.id === consumptionType)?.label}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Consommation</Text>
          <Text style={styles.summaryValue}>{consumptionValue > 0 ? consumptionValue : 0} / jour</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Coût quotidien</Text>
          <Text style={styles.summaryValue}>{projectedDailyCost} €</Text>
        </View>
      </View>

      <Text style={styles.motivationText}>
        Votre compteur démarre maintenant. Chaque minute compte !
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          testID="step-three-back"
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => setStep(2)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonSecondaryText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          testID="onboarding-complete"
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.accent, '#F39C12']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Commencer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.secondary + '20']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { 
            paddingTop: insets.top + 20, 
            paddingBottom: Math.max(insets.bottom, 40)
          }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
            </View>
            <Text style={styles.stepIndicator}>Étape {step} sur 3</Text>
          </View>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600' as const,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'space-between' as const,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  optionCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  inputUnit: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    gap: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  summaryValue: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700' as const,
  },
  motivationText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonPrimary: {
    flex: 1,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  buttonSecondaryText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '600' as const,
  },
});
