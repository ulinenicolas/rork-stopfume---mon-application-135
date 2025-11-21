import { useEffect, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import Colors from '../constants/colors';

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();
  const { userData, isLoading } = useApp();

  const navigate = useCallback(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    
    if (!userData.isOnboarded) {
      if (segments[0] !== 'onboarding') {
        router.replace('/onboarding');
      }
    } else {
      if (!inTabsGroup) {
        router.replace('/(tabs)/home');
      }
    }
  }, [isLoading, segments, userData.isOnboarded, router]);

  useEffect(() => {
    navigate();
  }, [navigate]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
