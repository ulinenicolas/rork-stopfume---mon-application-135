import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Sparkles, Wind, Users, LucideIcon } from 'lucide-react-native';
import type { AdSlot } from '../constants/ad-slots';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Wind,
  Users,
};

interface AdCarouselProps {
  slots: AdSlot[];
}

export default function AdCarousel({ slots }: AdCarouselProps) {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scheduleAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (slots.length <= 1) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % slots.length;
        scrollRef.current?.scrollTo?.({ x: nextIndex * width * 0.9, animated: true });
        console.log('[AdCarousel] auto-scroll to slot', slots[nextIndex]?.id);
        return nextIndex;
      });
    }, 6500);
  }, [slots]);

  useEffect(() => {
    scheduleAutoScroll();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [scheduleAutoScroll]);

  const onMomentumScrollEnd = useCallback((event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const { contentOffset } = event.nativeEvent;
    const newIndex = Math.round(contentOffset.x / (width * 0.9));
    console.log('[AdCarousel] manual scroll activeIndex', newIndex);
    setActiveIndex(newIndex);
    scheduleAutoScroll();
  }, [scheduleAutoScroll]);

  const onPressSlot = useCallback((slot: AdSlot) => {
    console.log('[AdCarousel] press slot', slot.id);
    if (slot.route) {
      router.push(slot.route as never);
    }
  }, [router]);

  const renderIcon = useCallback((slot: AdSlot) => {
    const Icon = ICON_MAP[slot.icon] || Sparkles;
    return <Icon size={28} color="#FFFFFF" strokeWidth={2.5} />;
  }, []);

  if (!slots.length) {
    return null;
  }

  return (
    <View style={styles.container} testID="ad-carousel-container">
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width * 0.9}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.scrollContent}
        testID="ad-carousel-scroll"
      >
        {slots.map((slot) => (
          <View key={slot.id} style={styles.slideWrapper}>
            <LinearGradient
              colors={slot.backgroundGradient}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerRow}>
                <View style={styles.iconBadge}>{renderIcon(slot)}</View>
                <View style={[styles.variantBadge, styles[`variant${slot.variant}` as const]]}>
                  <Text style={styles.variantText}>{slot.highlight}</Text>
                </View>
              </View>

              <Text style={styles.title} numberOfLines={2}>{slot.title}</Text>
              <Text style={styles.tagline}>{slot.tagline}</Text>

              <View style={styles.metricsRow}>
                <View style={styles.metricPill}>
                  <Text style={styles.metricFocus}>{slot.metrics.focus}</Text>
                  <Text style={styles.metricValue}>{slot.metrics.value}</Text>
                  <Text style={styles.metricFootnote}>{slot.metrics.footnote}</Text>
                </View>
                <View style={styles.featuresList}>
                  {slot.features.map((feature) => (
                    <Text key={feature} style={styles.featureItem} numberOfLines={1}>
                      • {feature}
                    </Text>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.ctaButton}
                onPress={() => onPressSlot(slot)}
                testID={`ad-carousel-cta-${slot.id}`}
              >
                <Text style={styles.ctaText}>{slot.cta}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))}
      </Animated.ScrollView>
      <View style={styles.indicatorContainer} testID="ad-carousel-indicators">
        {slots.map((slot, index) => (
          <View
            key={slot.id}
            style={[styles.indicatorDot, index === activeIndex && styles.indicatorDotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  slideWrapper: {
    width: width * 0.9,
    paddingRight: 12,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  variantBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  variantpremium: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  variantsponsored: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  variantcommunity: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  variantText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800' as const,
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  metricsRow: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  metricPill: {
    width: 140,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 4,
  },
  metricFocus: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900' as const,
  },
  metricFootnote: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  featuresList: {
    flex: 1,
    justifyContent: 'space-between' as const,
    gap: 8,
  },
  featureItem: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  ctaButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: Colors.primary,
  },
  ctaText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  indicatorContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginTop: 12,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  indicatorDotActive: {
    backgroundColor: Colors.primary,
    width: 18,
  },
});
