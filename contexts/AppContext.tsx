import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserData, CravingEntry, MoodEntry, Achievement, DailyLog } from '../types/app';
import { ACHIEVEMENTS } from '../constants/achievements';

const STORAGE_KEYS = {
  USER_DATA: '@quit_app_user_data',
  CRAVINGS: '@quit_app_cravings',
  MOODS: '@quit_app_moods',
  DAILY_LOGS: '@quit_app_daily_logs',
};

const DEFAULT_USER_DATA: UserData = {
  consumptionType: 'cigarettes',
  quitDate: new Date().toISOString(),
  dailyConsumption: 20,
  costPerUnit: 0.5,
  currency: '€',
  isOnboarded: false,
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [cravings, setCravings] = useState<CravingEntry[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  const userDataQuery = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return stored ? JSON.parse(stored) : DEFAULT_USER_DATA;
    },
  });

  const cravingsQuery = useQuery({
    queryKey: ['cravings'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CRAVINGS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const moodsQuery = useQuery({
    queryKey: ['moods'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MOODS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const dailyLogsQuery = useQuery({
    queryKey: ['dailyLogs'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  useEffect(() => {
    if (userDataQuery.data) {
      setUserData(userDataQuery.data);
    }
  }, [userDataQuery.data]);

  useEffect(() => {
    if (cravingsQuery.data) {
      setCravings(cravingsQuery.data);
    }
  }, [cravingsQuery.data]);

  useEffect(() => {
    if (moodsQuery.data) {
      setMoods(moodsQuery.data);
    }
  }, [moodsQuery.data]);

  useEffect(() => {
    if (dailyLogsQuery.data) {
      setDailyLogs(dailyLogsQuery.data);
    }
  }, [dailyLogsQuery.data]);

  const updateUserDataMutation = useMutation({
    mutationFn: async (newData: Partial<UserData>) => {
      const updated = { ...userData, ...newData };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      setUserData(updated);
    },
  });

  const addCravingMutation = useMutation({
    mutationFn: async (craving: Omit<CravingEntry, 'id' | 'timestamp'>) => {
      const newCraving: CravingEntry = {
        ...craving,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updated = [...cravings, newCraving];
      await AsyncStorage.setItem(STORAGE_KEYS.CRAVINGS, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      setCravings(updated);
    },
  });

  const addMoodMutation = useMutation({
    mutationFn: async (mood: Omit<MoodEntry, 'id' | 'timestamp'>) => {
      const newMood: MoodEntry = {
        ...mood,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updated = [...moods, newMood];
      await AsyncStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      setMoods(updated);
    },
  });

  const addDailyLogMutation = useMutation({
    mutationFn: async (log: Omit<DailyLog, 'id'>) => {
      const today = new Date().toISOString().split('T')[0];
      const existingLogIndex = dailyLogs.findIndex(l => l.date === today);
      
      let updated: DailyLog[];
      if (existingLogIndex !== -1) {
        updated = [...dailyLogs];
        updated[existingLogIndex] = {
          ...updated[existingLogIndex],
          count: log.count,
          notes: log.notes,
        };
      } else {
        const newLog: DailyLog = {
          ...log,
          id: Date.now().toString(),
          date: today,
        };
        updated = [...dailyLogs, newLog];
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      setDailyLogs(updated);
    },
  });

  const resetDataMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.CRAVINGS,
        STORAGE_KEYS.MOODS,
        STORAGE_KEYS.DAILY_LOGS,
      ]);
      return DEFAULT_USER_DATA;
    },
    onSuccess: (reset) => {
      setUserData(reset);
      setCravings([]);
      setMoods([]);
      setDailyLogs([]);
    },
  });

  const { mutate: mutateUserData } = updateUserDataMutation;
  const { mutate: mutateCraving } = addCravingMutation;
  const { mutate: mutateMood } = addMoodMutation;
  const { mutate: mutateDailyLog } = addDailyLogMutation;
  const { mutate: mutateReset } = resetDataMutation;

  const updateUserData = useCallback((data: Partial<UserData>) => {
    mutateUserData(data);
  }, [mutateUserData]);

  const addCraving = useCallback((craving: Omit<CravingEntry, 'id' | 'timestamp'>) => {
    mutateCraving(craving);
  }, [mutateCraving]);

  const addMood = useCallback((mood: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    mutateMood(mood);
  }, [mutateMood]);

  const addDailyLog = useCallback((log: Omit<DailyLog, 'id'>) => {
    mutateDailyLog(log);
  }, [mutateDailyLog]);

  const resetData = useCallback(() => {
    mutateReset();
  }, [mutateReset]);

  return useMemo(() => ({
    userData,
    cravings,
    moods,
    dailyLogs,
    isLoading: userDataQuery.isLoading || cravingsQuery.isLoading || moodsQuery.isLoading || dailyLogsQuery.isLoading,
    updateUserData,
    addCraving,
    addMood,
    addDailyLog,
    resetData,
  }), [userData, cravings, moods, dailyLogs, userDataQuery.isLoading, cravingsQuery.isLoading, moodsQuery.isLoading, dailyLogsQuery.isLoading, updateUserData, addCraving, addMood, addDailyLog, resetData]);
});

export function useStats() {
  const { userData, cravings } = useApp();

  return useMemo(() => {
    const quitDate = new Date(userData.quitDate);
    const now = new Date();
    const millisecondsDiff = now.getTime() - quitDate.getTime();
    const daysSinceQuit = Math.max(0, millisecondsDiff / (1000 * 60 * 60 * 24));
    
    const hoursSinceQuit = Math.max(0, millisecondsDiff / (1000 * 60 * 60));
    const minutesSinceQuit = Math.max(0, millisecondsDiff / (1000 * 60));
    
    const consumptionAvoided = Math.floor(daysSinceQuit * userData.dailyConsumption);
    const moneySaved = consumptionAvoided * userData.costPerUnit;
    
    const cravingsAvoided = cravings.filter(c => c.avoided).length;
    const totalCravings = cravings.length;

    return {
      daysSinceQuit,
      hoursSinceQuit,
      minutesSinceQuit,
      consumptionAvoided,
      moneySaved,
      cravingsAvoided,
      totalCravings,
    };
  }, [userData, cravings]);
}

export function useAchievements() {
  const { daysSinceQuit } = useStats();

  return useMemo(() => {
    return ACHIEVEMENTS.map(achievement => {
      const unlocked = daysSinceQuit >= achievement.daysRequired;
      return {
        ...achievement,
        unlocked,
        unlockedDate: unlocked ? new Date().toISOString() : undefined,
      } as Achievement;
    });
  }, [daysSinceQuit]);
}
