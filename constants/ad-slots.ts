export type AdSlotVariant = 'premium' | 'sponsored' | 'community';

export interface AdSlot {
  id: string;
  title: string;
  tagline: string;
  cta: string;
  variant: AdSlotVariant;
  highlight: string;
  backgroundGradient: readonly [string, string];
  icon: string;
  route: string;
  metrics: {
    focus: string;
    value: string;
    footnote: string;
  };
  features: string[];
}

export const AD_SLOTS: AdSlot[] = [
  {
    id: 'premium-immersive-program',
    title: 'Programme 30 jours Focus Mind',
    tagline: 'Chaque jour : défi, exercice mental, message boost',
    cta: 'Débloquer le coaching',
    variant: 'premium',
    highlight: 'Rentabilité x4',
    backgroundGradient: ['#1F2657', '#312F79'],
    icon: 'Sparkles',
    route: '/program',
    metrics: {
      focus: 'Adhérence',
      value: '86%',
      footnote: 'Utilisateurs premium actifs 30 jours',
    },
    features: [
      'Défi guidé quotidien',
      'Exercice respiration consciente',
      'Projection financière personnalisée',
    ],
  },
  {
    id: 'sponsored-health-lab',
    title: 'Pack Bien-être Respire Lab',
    tagline: 'Routines respiration + playlist focus',
    cta: 'Tester gratuitement',
    variant: 'sponsored',
    highlight: 'Offre limitée',
    backgroundGradient: ['#1A3A4F', '#0D1F2A'],
    icon: 'Wind',
    route: '/mood',
    metrics: {
      focus: 'Temps calme',
      value: '+18 min/j',
      footnote: 'En moyenne chez les testeurs',
    },
    features: [
      '5 respirations guidées exclusives',
      'Tracking de l’anxiété live',
      'Sons binauraux focus',
    ],
  },
  {
    id: 'community-challenge',
    title: 'Défi Communauté Zero Craving',
    tagline: '7 jours, tu gagnes +2 badges élite',
    cta: 'Rejoindre le défi',
    variant: 'community',
    highlight: 'Places limitées',
    backgroundGradient: ['#2E1338', '#481D52'],
    icon: 'Users',
    route: '/stats',
    metrics: {
      focus: 'Stabilité humeur',
      value: '+42%',
      footnote: 'Mood tracker sur 7 jours',
    },
    features: [
      'Soutien collectif en direct',
      'Notifications motivation ciblées',
      'Leaderboard + récompenses déblocables',
    ],
  },
];
