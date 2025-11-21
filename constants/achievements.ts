import { Achievement } from '../types/app';

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedDate'>[] = [
  {
    id: '1-hour',
    title: 'Première heure',
    description: '1 heure sans fumer',
    daysRequired: 1 / 24,
    icon: 'clock',
  },
  {
    id: '24-hours',
    title: 'Premier jour',
    description: '24 heures sans fumer',
    daysRequired: 1,
    icon: 'sun',
  },
  {
    id: '3-days',
    title: 'Trois jours',
    description: '3 jours sans fumer',
    daysRequired: 3,
    icon: 'star',
  },
  {
    id: '1-week',
    title: 'Une semaine',
    description: '7 jours sans fumer',
    daysRequired: 7,
    icon: 'award',
  },
  {
    id: '2-weeks',
    title: 'Deux semaines',
    description: '14 jours sans fumer',
    daysRequired: 14,
    icon: 'zap',
  },
  {
    id: '1-month',
    title: 'Un mois',
    description: '30 jours sans fumer',
    daysRequired: 30,
    icon: 'trophy',
  },
  {
    id: '3-months',
    title: 'Trois mois',
    description: '90 jours sans fumer',
    daysRequired: 90,
    icon: 'crown',
  },
  {
    id: '6-months',
    title: 'Six mois',
    description: '180 jours sans fumer',
    daysRequired: 180,
    icon: 'gem',
  },
  {
    id: '1-year',
    title: 'Un an',
    description: '365 jours sans fumer',
    daysRequired: 365,
    icon: 'sparkles',
  },
];
