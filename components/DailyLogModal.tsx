import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Plus, Minus, Check, Cigarette } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../contexts/AppContext';
import Colors from '../constants/colors';

interface DailyLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DailyLogModal({ visible, onClose }: DailyLogModalProps) {
  const { addDailyLog, dailyLogs } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find(l => l.date === today);
  
  const [count, setCount] = useState<number>(todayLog?.count || 0);
  const [notes, setNotes] = useState<string>(todayLog?.notes || '');

  const handleIncrement = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCount(c => c + 1);
  };

  const handleDecrement = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCount(c => Math.max(0, c - 1));
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    addDailyLog({
      date: today,
      count,
      notes: notes.trim() || undefined,
    });

    Alert.alert(
      count === 0 ? 'Bravo !' : 'Merci !',
      count === 0 
        ? 'Continue comme ça, tu es incroyable ! 💪'
        : 'Reste fort·e, chaque jour compte. On est là pour toi ! 💙'
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.modalHeaderIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Cigarette size={24} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>Log Aujourd&apos;hui</Text>
              <Text style={styles.modalSubtitle}>Suivi honnête = progrès réel</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textLight} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={[Colors.cardBackground, Colors.cardLight]}
            style={styles.counterCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.counterLabel}>Nombre consommé aujourd&apos;hui</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                onPress={handleDecrement}
                style={[styles.counterButton, count === 0 && styles.counterButtonDisabled]}
                disabled={count === 0}
                activeOpacity={0.7}
              >
                <Minus size={24} color={count === 0 ? Colors.textMuted : Colors.primary} strokeWidth={3} />
              </TouchableOpacity>
              
              <View style={styles.counterDisplay}>
                <Text style={styles.counterValue}>{count}</Text>
              </View>

              <TouchableOpacity
                onPress={handleIncrement}
                style={styles.counterButton}
                activeOpacity={0.7}
              >
                <Plus size={24} color={Colors.primary} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes (optionnel)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Comment te sens-tu ? Qu&apos;est-ce qui a aidé ou déclenché ?"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

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
                <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end' as const,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
    gap: 12,
  },
  modalHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900' as const,
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  counterCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counterLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  counterRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 20,
  },
  counterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  counterButtonDisabled: {
    opacity: 0.3,
  },
  counterDisplay: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 3,
    borderColor: Colors.primary + '40',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: '900' as const,
    color: Colors.text,
  },
  notesContainer: {
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  notesInput: {
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
  buttonsRow: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.textLight,
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    padding: 18,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
});
