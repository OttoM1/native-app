export const MOTIVATIONAL_TIPS = [
  {
    id: '1',
    message: "Every expert was once a beginner. You're on the right path! 🚀",
    category: 'motivation',
  },
  {
    id: '2',
    message: "Pro tip: Build projects, not just tutorials. Your portfolio is your superpower.",
    category: 'advice',
  },
  {
    id: '3',
    message: "Consistency beats intensity. 20 minutes daily > 5 hours once a week.",
    category: 'strategy',
  },
  {
    id: '4',
    message: "Stuck on a bug? Take a break. Your brain solves problems while you rest.",
    category: 'advice',
  },
  {
    id: '5',
    message: "The best time to start was yesterday. The second best time is now.",
    category: 'motivation',
  },
  {
    id: '6',
    message: "Document what you learn. Future you will thank present you.",
    category: 'strategy',
  },
  {
    id: '7',
    message: "Impostor syndrome? That means you're growing. Keep pushing! 💪",
    category: 'motivation',
  },
  {
    id: '8',
    message: "Don't compare your chapter 1 to someone else's chapter 20.",
    category: 'mindset',
  },
  {
    id: '9',
    message: "Ship it! Imperfect action beats perfect inaction every time.",
    category: 'advice',
  },
  {
    id: '10',
    message: "Your network is your net worth. Connect with other learners!",
    category: 'strategy',
  },
  {
    id: '11',
    message: "Debugging is twice as hard as writing code. Write simple, readable code.",
    category: 'technical',
  },
  {
    id: '12',
    message: "The best way to learn is to teach. Share what you know!",
    category: 'strategy',
  },
  {
    id: '13',
    message: "Focus on understanding concepts, not memorizing syntax. Google exists for a reason.",
    category: 'mindset',
  },
  {
    id: '14',
    message: "Your first draft will be terrible. And that's perfectly okay! ✨",
    category: 'motivation',
  },
  {
    id: '15',
    message: "Break big goals into tiny tasks. Small wins compound into major victories.",
    category: 'strategy',
  },
];

export const getRandomTip = (): typeof MOTIVATIONAL_TIPS[0] => {
  return MOTIVATIONAL_TIPS[Math.floor(Math.random() * MOTIVATIONAL_TIPS.length)];
};

export const getTipsByCategory = (category: string) => {
  return MOTIVATIONAL_TIPS.filter(tip => tip.category === category);
};