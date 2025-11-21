import { Tabs } from "expo-router";
import { Home, AlertCircle, TrendingUp, User, Heart, BookOpen } from "lucide-react-native";
import React from "react";
import Colors from "../../constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: "Programme",
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: "Urgence",
          tabBarIcon: ({ color, size }) => <AlertCircle color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: "Humeur",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}
