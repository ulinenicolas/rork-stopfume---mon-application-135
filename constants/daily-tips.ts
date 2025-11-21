export interface DailyTip {
  day: number;
  title: string;
  content: string;
  category: 'motivation' | 'health' | 'strategy' | 'wellness';
}

export const DAILY_TIPS: DailyTip[] = [
  {
    day: 1,
    title: "Bravo pour ton premier jour !",
    content: "Les premières 24h sont les plus difficiles. Bois beaucoup d'eau, respire profondément et rappelle-toi pourquoi tu as décidé d'arrêter. Tu peux le faire ! 💪",
    category: 'motivation'
  },
  {
    day: 2,
    title: "La nicotine quitte ton corps",
    content: "À ce stade, la nicotine est presque entièrement éliminée de ton organisme. Les envies sont fortes, mais elles ne durent que quelques minutes. Utilise le mode urgence quand ça devient difficile.",
    category: 'health'
  },
  {
    day: 3,
    title: "Ton goût et ton odorat s'améliorent",
    content: "Tes sens commencent à revenir ! Tu vas bientôt redécouvrir les saveurs et les odeurs. C'est un des premiers cadeaux que ton corps te fait.",
    category: 'health'
  },
  {
    day: 4,
    title: "Identifie tes déclencheurs",
    content: "Note les moments où l'envie est la plus forte : café du matin, pause, stress... Anticipe ces moments et prépare des alternatives (chewing-gum, marche, eau).",
    category: 'strategy'
  },
  {
    day: 5,
    title: "Respiration et détente",
    content: "Le stress peut déclencher des envies. Pratique la respiration profonde : inspire 4 secondes, retiens 4 secondes, expire 6 secondes. Répète 5 fois.",
    category: 'wellness'
  },
  {
    day: 6,
    title: "Tu respires mieux",
    content: "Ta capacité pulmonaire commence à s'améliorer. Essaie de marcher plus, tu verras la différence ! L'exercice aide aussi à gérer les envies.",
    category: 'health'
  },
  {
    day: 7,
    title: "Une semaine de liberté ! 🎉",
    content: "Félicitations, tu as passé une semaine entière ! C'est énorme. Les envies physiques diminuent, maintenant c'est surtout l'habitude. Continue, tu gères !",
    category: 'motivation'
  },
  {
    day: 8,
    title: "Récompense-toi",
    content: "Avec l'argent économisé, offre-toi quelque chose de sympa. Tu le mérites ! Cela renforce ta motivation et te montre les bénéfices concrets.",
    category: 'motivation'
  },
  {
    day: 9,
    title: "Ton énergie revient",
    content: "Tu devrais remarquer plus d'énergie et moins de fatigue. Ton corps te remercie déjà ! Profite-en pour être plus actif.",
    category: 'health'
  },
  {
    day: 10,
    title: "Évite les situations à risque",
    content: "Si possible, évite temporairement les endroits où tu fumais. Crée de nouvelles habitudes dans de nouveaux lieux.",
    category: 'strategy'
  },
  {
    day: 11,
    title: "Parle de ton succès",
    content: "Partage tes progrès avec tes proches. Leur soutien est précieux et verbaliser ta réussite la rend plus réelle.",
    category: 'motivation'
  },
  {
    day: 12,
    title: "Hydrate-toi !",
    content: "L'eau aide à éliminer les toxines et réduit les envies. Vise 2L par jour. Ajoute du citron pour le goût !",
    category: 'wellness'
  },
  {
    day: 13,
    title: "Ta peau s'améliore",
    content: "La circulation s'améliore, ta peau commence à avoir meilleure mine. Un autre bénéfice visible de ton arrêt !",
    category: 'health'
  },
  {
    day: 14,
    title: "Deux semaines ! 🌟",
    content: "Tu as doublé ton record ! Chaque jour qui passe rend la suite plus facile. Les envies sont moins fréquentes maintenant.",
    category: 'motivation'
  },
  {
    day: 15,
    title: "Gère le stress autrement",
    content: "Trouve de nouvelles façons de décompresser : sport, méditation, musique, dessin... Expérimente !",
    category: 'strategy'
  },
  {
    day: 16,
    title: "Ton sommeil s'améliore",
    content: "Sans nicotine, ton sommeil devient plus réparateur. Tu te réveilles plus frais. Établis une routine de sommeil régulière.",
    category: 'wellness'
  },
  {
    day: 17,
    title: "Les envies changent",
    content: "Les envies physiques ont largement diminué. C'est maintenant l'habitude psychologique. Tu es plus fort qu'elle !",
    category: 'health'
  },
  {
    day: 18,
    title: "Visualise ton succès",
    content: "Prends 5 minutes chaque jour pour visualiser ta vie sans tabac. Imagine-toi dans 6 mois, 1 an. Cette technique renforce ta détermination.",
    category: 'strategy'
  },
  {
    day: 19,
    title: "Ton système immunitaire se renforce",
    content: "Ton corps se défend mieux contre les infections. Tu vas tomber moins souvent malade !",
    category: 'health'
  },
  {
    day: 20,
    title: "Reste vigilant",
    content: "La complaisance est l'ennemi. \"Juste une\" n'existe pas. Rappelle-toi d'où tu viens et combien tu as progressé.",
    category: 'strategy'
  },
  {
    day: 21,
    title: "Trois semaines ! 🚀",
    content: "On dit qu'il faut 21 jours pour créer une habitude. Tu as créé l'habitude de NE PAS fumer. Incroyable !",
    category: 'motivation'
  },
  {
    day: 22,
    title: "Ton cardio s'améliore",
    content: "Ton cœur et tes poumons fonctionnent mieux. Monter les escaliers est plus facile. Continue à bouger !",
    category: 'health'
  },
  {
    day: 23,
    title: "Fais du sport",
    content: "L'exercice produit des endorphines, comme la cigarette, mais en mieux ! Trouve une activité que tu aimes.",
    category: 'wellness'
  },
  {
    day: 24,
    title: "Compte ton argent économisé",
    content: "Regarde combien tu as économisé. Impressionnant, non ? Pense à ce que tu vas faire avec !",
    category: 'motivation'
  },
  {
    day: 25,
    title: "Les moments difficiles passent",
    content: "Si tu as encore des envies, rappelle-toi : elles ne durent que 3-5 minutes. Distraction, eau, respiration. Tu connais la routine !",
    category: 'strategy'
  },
  {
    day: 26,
    title: "Ta circulation est meilleure",
    content: "Ton sang circule mieux, tes extrémités sont moins froides. Ton corps se régénère de jour en jour.",
    category: 'health'
  },
  {
    day: 27,
    title: "Prends soin de toi",
    content: "Profite de ce moment pour améliorer d'autres aspects de ta vie : alimentation, sommeil, relations. Tu mérites le meilleur !",
    category: 'wellness'
  },
  {
    day: 28,
    title: "Presque un mois !",
    content: "Dans quelques jours, tu auras un mois complet. C'est énorme ! Tu es en train de réussir quelque chose d'incroyable.",
    category: 'motivation'
  },
  {
    day: 29,
    title: "Aide les autres",
    content: "Si quelqu'un veut arrêter, partage ton expérience. Aider les autres renforce ta propre détermination.",
    category: 'motivation'
  },
  {
    day: 30,
    title: "UN MOIS ! 🏆",
    content: "FÉLICITATIONS ! Un mois entier sans fumer ! Tu as prouvé que tu es plus fort. Continue, le meilleur reste à venir !",
    category: 'motivation'
  }
];
