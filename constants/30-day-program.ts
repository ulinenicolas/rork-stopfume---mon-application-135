export interface DailyProgram {
  day: number;
  challenge: string;
  healthTip: string;
  mentalExercise: string;
  motivationalMessage: string;
  isPremium: boolean;
}

export const PROGRAM_30_DAYS: DailyProgram[] = [
  {
    day: 1,
    challenge: "Jette tous tes accessoires (briquets, cendriers...)",
    healthTip: "La nicotine quitte ton corps en 72h. Ton corps commence déjà sa régénération.",
    mentalExercise: "Écris 3 raisons personnelles pour lesquelles tu arrêtes. Relis-les ce soir.",
    motivationalMessage: "Le premier jour est le plus courageux. Tu as déjà gagné ! 💪",
    isPremium: false
  },
  {
    day: 2,
    challenge: "Note chaque envie sur papier, puis froisse-la et jette-la",
    healthTip: "Ton rythme cardiaque commence à se normaliser. Ton cœur te remercie !",
    mentalExercise: "Quand l'envie vient, compte à rebours de 10 à 0 en respirant profondément.",
    motivationalMessage: "Chaque minute sans fumer est une victoire. Tu es plus fort que l'envie ! 🔥",
    isPremium: false
  },
  {
    day: 3,
    challenge: "Remplace ta pause cigarette par une pause marche de 5 minutes",
    healthTip: "Ton goût et ton odorat commencent à revenir. Tu vas redécouvrir les saveurs !",
    mentalExercise: "Visualise-toi dans 1 an, libre et en pleine santé. Ressens cette fierté.",
    motivationalMessage: "72h ! La nicotine physique est partie. Tu as déjà fait le plus dur ! 🌟",
    isPremium: false
  },
  {
    day: 4,
    challenge: "Identifie ton plus gros déclencheur et trouve une alternative concrète",
    healthTip: "Ta circulation sanguine s'améliore. Tes extrémités sont moins froides.",
    mentalExercise: "Pense à une situation difficile passée que tu as surmontée. Tu peux le faire encore.",
    motivationalMessage: "Les habitudes changent. Tu es en train de devenir quelqu'un de nouveau ! 💎",
    isPremium: true
  },
  {
    day: 5,
    challenge: "Bois 2L d'eau aujourd'hui pour nettoyer ton organisme",
    healthTip: "Tes poumons commencent à éliminer le mucus et les résidus. Respire à fond !",
    mentalExercise: "Pratique 5 minutes de respiration consciente : 4 temps in, 7 temps out.",
    motivationalMessage: "Ton corps se nettoie, ton esprit se libère. Continue ! 💧",
    isPremium: true
  },
  {
    day: 6,
    challenge: "Fais 20 minutes d'exercice physique (marche, vélo, sport...)",
    healthTip: "Ta capacité pulmonaire augmente de 10%. Sens la différence !",
    mentalExercise: "Répète ce mantra 10 fois : 'Je suis libre. Je contrôle mes choix.'",
    motivationalMessage: "Ton énergie revient. Profite de cette nouvelle force ! ⚡",
    isPremium: true
  },
  {
    day: 7,
    challenge: "Célèbre ta semaine ! Offre-toi quelque chose avec l'argent économisé",
    healthTip: "Ton risque de crise cardiaque commence déjà à diminuer. Incroyable !",
    mentalExercise: "Écris une lettre à ton futur toi dans 1 an. Décris ta fierté.",
    motivationalMessage: "UNE SEMAINE COMPLÈTE ! Tu as prouvé ta force. C'est ÉNORME ! 🏆",
    isPremium: false
  },
  {
    day: 8,
    challenge: "Nettoie à fond un endroit où tu fumais (voiture, balcon...)",
    healthTip: "Tes sens du goût et de l'odorat sont 2x meilleurs qu'avant !",
    mentalExercise: "Liste 5 bénéfices que tu ressens déjà physiquement ou mentalement.",
    motivationalMessage: "Chaque jour t'éloigne de l'ancien toi. Continue d'avancer ! 🚀",
    isPremium: true
  },
  {
    day: 9,
    challenge: "Appelle ou texte quelqu'un qui te soutient pour partager ta fierté",
    healthTip: "Ton système immunitaire se renforce. Tu tombes moins malade !",
    mentalExercise: "Imagine ton corps comme une maison en rénovation. Chaque jour = une pièce réparée.",
    motivationalMessage: "Le soutien des autres décuple ta force. Tu n'es pas seul ! 🤝",
    isPremium: true
  },
  {
    day: 10,
    challenge: "Teste une nouvelle activité relaxante (yoga, dessin, musique...)",
    healthTip: "Ton niveau d'énergie est 20% supérieur à la semaine dernière !",
    mentalExercise: "Pratique la gratitude : remercie ton corps pour sa capacité de guérison.",
    motivationalMessage: "Tu découvres de nouvelles façons d'être heureux. Explore ! 🎨",
    isPremium: true
  },
  {
    day: 11,
    challenge: "Évite consciemment les lieux où tu fumais le plus",
    healthTip: "La toux du fumeur diminue. Tes poumons se nettoient activement.",
    mentalExercise: "Quand l'envie vient, demande-toi : 'Est-ce que je veux vraiment recommencer à ZÉRO ?'",
    motivationalMessage: "Changer ses habitudes = changer ses lieux. Tu crées ton nouvel environnement ! 🌍",
    isPremium: true
  },
  {
    day: 12,
    challenge: "Prépare des snacks sains pour les moments de craving",
    healthTip: "Ta peau commence à être plus lumineuse. La circulation s'améliore !",
    mentalExercise: "Visualise l'argent économisé comme une montagne qui grandit chaque jour.",
    motivationalMessage: "Prendre soin de toi devient naturel. Tu le mérites ! 🥗",
    isPremium: true
  },
  {
    day: 13,
    challenge: "Fais du rangement/tri dans ta vie (papiers, vêtements, numérique)",
    healthTip: "Ton sommeil est plus profond et réparateur sans nicotine.",
    mentalExercise: "Nettoyer ton environnement = nettoyer ton esprit. Ressens cette légèreté.",
    motivationalMessage: "Ordre externe = ordre interne. Tu construis ta nouvelle vie ! 📦",
    isPremium: true
  },
  {
    day: 14,
    challenge: "Deux semaines ! Prends une photo de toi pour voir la différence",
    healthTip: "Ton teint est plus clair, tes yeux plus brillants. Tu es radieux !",
    mentalExercise: "Compare cette photo mentalement à celle d'il y a 2 semaines. Vois le changement.",
    motivationalMessage: "14 JOURS ! Tu as doublé la première semaine. RIEN ne peut t'arrêter ! 🌟",
    isPremium: false
  },
  {
    day: 15,
    challenge: "Essaie une nouvelle technique de respiration anti-stress",
    healthTip: "Ta circulation sanguine est 30% meilleure qu'il y a 2 semaines !",
    mentalExercise: "Box breathing : 4 temps inspire, 4 retiens, 4 expire, 4 pause. Répète 5 fois.",
    motivationalMessage: "La respiration est ton super-pouvoir contre le stress. Maîtrise-la ! 🧘",
    isPremium: true
  },
  {
    day: 16,
    challenge: "Écris une liste de 10 choses que tu aimes dans ta nouvelle vie",
    healthTip: "Tes poumons fonctionnent 30% mieux. Monter les escaliers est plus facile !",
    mentalExercise: "Relis cette liste chaque matin pendant 3 jours. Ancre ces bénéfices.",
    motivationalMessage: "Tu ne 'arrêtes' pas quelque chose, tu GAGNES une nouvelle vie ! 📝",
    isPremium: true
  },
  {
    day: 17,
    challenge: "Planifie une sortie ou activité que tu remettais à plus tard",
    healthTip: "Ton niveau d'oxygène dans le sang est optimal. Tu te sens vivant !",
    mentalExercise: "La vie est courte. Fais cette chose que tu voulais faire. Maintenant.",
    motivationalMessage: "Plus d'argent, plus d'énergie, plus de temps. PROFITE ! 🎉",
    isPremium: true
  },
  {
    day: 18,
    challenge: "Aide quelqu'un aujourd'hui (famille, ami, étranger...)",
    healthTip: "Ton système nerveux se rééquilibre. Tu es moins irritable !",
    mentalExercise: "Aider les autres = renforcer ton propre mental. Ressens cette connexion.",
    motivationalMessage: "En devenant meilleur pour toi, tu deviens meilleur pour les autres ! 💚",
    isPremium: true
  },
  {
    day: 19,
    challenge: "Médite 10 minutes (utilise une app si besoin)",
    healthTip: "Ta pression artérielle se normalise. Ton cœur bat plus calmement.",
    mentalExercise: "Observe tes pensées comme des nuages qui passent. Ne les juge pas.",
    motivationalMessage: "Le calme intérieur est ton nouveau pouvoir. Cultive-le ! 🧘‍♂️",
    isPremium: true
  },
  {
    day: 20,
    challenge: "Cuisine un repas sain et délicieux pour profiter de ton goût retrouvé",
    healthTip: "Tes papilles gustatives sont complètement régénérées. Redécouvre la saveur !",
    mentalExercise: "Mange en conscience. Savoure chaque bouchée. C'est un cadeau.",
    motivationalMessage: "La nourriture n'a jamais eu si bon goût. Profite de chaque sensation ! 🍽️",
    isPremium: true
  },
  {
    day: 21,
    challenge: "21 jours = nouvelle habitude créée ! Célèbre avec tes proches",
    healthTip: "Scientifiquement, tu as recâblé ton cerveau. Tu es un non-fumeur maintenant !",
    mentalExercise: "Affirme-le haut et fort : 'Je suis un non-fumeur'. Crois-le.",
    motivationalMessage: "TROIS SEMAINES ! Ton cerveau a changé. Tu es officiellement LIBRE ! 🎊",
    isPremium: false
  },
  {
    day: 22,
    challenge: "Fais un don à une association santé ou aide quelqu'un à arrêter",
    healthTip: "Ton risque de maladies cardiaques baisse chaque jour qui passe.",
    mentalExercise: "Partager ton succès = le multiplier. Tu inspires les autres.",
    motivationalMessage: "Ton parcours peut sauver d'autres vies. Tu es un exemple ! 🌟",
    isPremium: true
  },
  {
    day: 23,
    challenge: "Teste une activité sportive que tu n'as jamais faite",
    healthTip: "Ton endurance physique a augmenté de 40% depuis le début !",
    mentalExercise: "Sortir de ta zone de confort = grandir. Ose l'inconnu.",
    motivationalMessage: "Ton nouveau corps peut faire des choses incroyables. Découvre-les ! 🏃",
    isPremium: true
  },
  {
    day: 24,
    challenge: "Calcule exactement ce que tu as économisé et planifie un gros achat",
    healthTip: "En moyenne, un fumeur économise 2000-3000€ par an en arrêtant !",
    mentalExercise: "Visualise cet achat. Ressens la satisfaction. Tu l'as mérité.",
    motivationalMessage: "Cet argent était littéralement parti en fumée. Maintenant il est À TOI ! 💰",
    isPremium: true
  },
  {
    day: 25,
    challenge: "Écris une lettre à ton 'moi fumeur' pour lui expliquer pourquoi tu ne reviens pas",
    healthTip: "Ton risque de cancer diminue de 1% chaque jour sans tabac.",
    mentalExercise: "Cette lettre est un contrat avec toi-même. Scelle ton engagement.",
    motivationalMessage: "Tu as fermé cette porte et jeté la clé. En avant ! ✍️",
    isPremium: true
  },
  {
    day: 26,
    challenge: "Passe du temps dans la nature (parc, forêt, plage...)",
    healthTip: "L'air frais est ton meilleur allié. Tes poumons le savent !",
    mentalExercise: "Respire l'air pur profondément. Remercie tes poumons pour leur travail.",
    motivationalMessage: "La nature te rappelle que tu fais partie d'un cycle de vie et de renouveau ! 🌲",
    isPremium: true
  },
  {
    day: 27,
    challenge: "Fais un check-up complet de ta routine (sommeil, alimentation, exercice)",
    healthTip: "Un mode de vie sain = protection maximale contre la rechute.",
    mentalExercise: "Optimise chaque aspect de ta vie. Tu es une machine de performance maintenant.",
    motivationalMessage: "Tu n'es pas juste 'ex-fumeur', tu es en train de devenir ta meilleure version ! 💯",
    isPremium: true
  },
  {
    day: 28,
    challenge: "Planifie tes objectifs pour les 6 prochains mois (sport, voyage, projet...)",
    healthTip: "Avoir des objectifs clairs = protection contre l'ennui et la rechute.",
    mentalExercise: "Écris ces objectifs. Visualise-les. Ils sont déjà en train de se réaliser.",
    motivationalMessage: "Le futur est brillant. Tu as prouvé que tu peux TOUT accomplir ! 🚀",
    isPremium: true
  },
  {
    day: 29,
    challenge: "Relis toutes tes notes depuis le jour 1. Mesure le chemin parcouru",
    healthTip: "Ton corps s'est régénéré à 80%. C'est presque miraculeux !",
    mentalExercise: "Compare le toi du jour 1 au toi d'aujourd'hui. C'est un super-héros.",
    motivationalMessage: "En 29 jours, tu t'es transformé. Demain, tu franchis la ligne d'arrivée ! 🏁",
    isPremium: true
  },
  {
    day: 30,
    challenge: "CÉLÈBRE ! 30 JOURS ! Fais quelque chose de SPÉCIAL pour toi",
    healthTip: "UN MOIS COMPLET ! Ton corps est transformé. Tu es biologiquement un non-fumeur !",
    mentalExercise: "Ferme les yeux. Ressens cette IMMENSE fierté. Tu l'as fait. C'est RÉEL.",
    motivationalMessage: "30 JOURS ! Tu as VAINCU ! Tu es LIBRE ! Tu es INCROYABLE ! CHAMPION ABSOLU ! 🏆👑🎊",
    isPremium: false
  }
];
