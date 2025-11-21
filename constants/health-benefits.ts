export interface HealthBenefit {
  days: number;
  title: string;
  description: string;
}

export const HEALTH_BENEFITS: HealthBenefit[] = [
  {
    days: 0.5,
    title: 'Circulation améliorée',
    description: 'Votre circulation sanguine commence à s\'améliorer',
  },
  {
    days: 1,
    title: 'Oxygène normalisé',
    description: 'Le niveau d\'oxygène dans votre sang revient à la normale',
  },
  {
    days: 2,
    title: 'Goût et odorat',
    description: 'Vos sens du goût et de l\'odorat commencent à s\'améliorer',
  },
  {
    days: 3,
    title: 'Respiration facilitée',
    description: 'Respirer devient plus facile, l\'énergie augmente',
  },
  {
    days: 7,
    title: 'Poumons en guérison',
    description: 'Vos poumons commencent à se nettoyer et à se réparer',
  },
  {
    days: 14,
    title: 'Circulation excellente',
    description: 'Votre circulation sanguine s\'est considérablement améliorée',
  },
  {
    days: 30,
    title: 'Fonction pulmonaire',
    description: 'Votre fonction pulmonaire peut s\'améliorer jusqu\'à 30%',
  },
  {
    days: 90,
    title: 'Risques réduits',
    description: 'Risque de crise cardiaque considérablement réduit',
  },
  {
    days: 180,
    title: 'Guérison majeure',
    description: 'Récupération importante de la fonction pulmonaire',
  },
  {
    days: 365,
    title: 'Risque cardiaque divisé',
    description: 'Votre risque de maladie cardiaque est réduit de 50%',
  },
];
