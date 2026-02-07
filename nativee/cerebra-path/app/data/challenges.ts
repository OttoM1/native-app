export interface ChallengeStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'link' | 'code' | 'task';
  link?: string;
  codeSnippet?: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; 
  description: string;
  skills: string[]; 
  skillGains: { [key: string]: number }; 
  steps: ChallengeStep[];
  tips: string[];
}

export const CATEGORIES = [
  { id: 'web-design', name: 'Web Design', icon: '🎨', color: '#73b0f5' },
  { id: 'app-dev', name: 'App Development', icon: '📱', color: '#73b0f5' },
  { id: 'ai-ml', name: 'AI & ML', icon: '🤖', color: '#73b0f5' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', icon: '💡', color: '#73b0f5' },
  { id: 'data-science', name: 'Data Science', icon: '📊', color: '#73b0f5' },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: '📢', color: '#73b0f5' },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'web-1',
    title: 'Build Your First Landing Page',
    category: 'web-design',
    difficulty: 'beginner',
    duration: '20 min',
    description: 'Create a stunning landing page using HTML, CSS, and modern design principles.',
    skills: ['HTML', 'CSS', 'Design'],
    skillGains: { 'HTML': 10, 'CSS': 10, 'Design': 5 },
    steps: [
      {
        id: 'step-1',
        title: 'Set up your HTML structure',
        content: 'Start with a basic HTML5 template. Include a header, hero section, features, and footer.',
        type: 'text',
      },
      {
        id: 'step-2',
        title: 'Learn about semantic HTML',
        content: 'Understanding semantic elements is crucial for accessibility and SEO.',
        type: 'link',
        link: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics',
      },
      {
        id: 'step-3',
        title: 'Add CSS styling',
        content: 'Use CSS Grid or Flexbox to create a responsive layout.',
        type: 'code',
        codeSnippet: `.hero {\n  display: flex;\n  min-height: 100vh;\n  align-items: center;\n  justify-content: center;\n}`,
      },
      {
        id: 'step-4',
        title: 'Make it responsive',
        content: 'Add media queries to ensure your page looks great on all devices.',
        type: 'task',
      },
    ],
    tips: [
      'Start with mobile-first design',
      'Use CSS variables for consistent colors',
      'Don\'t forget hover states for interactive elements',
    ],
  },
  {
    id: 'web-2',
    title: 'CSS Animations Mastery',
    category: 'web-design',
    difficulty: 'intermediate',
    duration: '30 min',
    description: 'Learn to create smooth, eye-catching animations using CSS.',
    skills: ['CSS', 'Animation', 'Design'],
    skillGains: { 'CSS': 15, 'Animation': 20, 'Design': 10 },
    steps: [
      {
        id: 'step-1',
        title: 'Understand CSS transitions',
        content: 'Transitions allow you to animate changes between CSS states smoothly.',
        type: 'text',
      },
      {
        id: 'step-2',
        title: 'Create keyframe animations',
        content: 'Keyframes give you precise control over animation sequences.',
        type: 'code',
        codeSnippet: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.element {\n  animation: fadeIn 1s ease-in;\n}`,
      },
      {
        id: 'step-3',
        title: 'Add transform effects',
        content: 'Use transforms for smooth scaling, rotation, and translation.',
        type: 'task',
      },
    ],
    tips: [
      'Use transform and opacity for GPU-accelerated animations',
      'Keep animations under 300ms for micro-interactions',
      'Test on mobile devices for performance',
    ],
  },
  {
    id: 'app-1',
    title: 'React Native Basics',
    category: 'app-dev',
    difficulty: 'beginner',
    duration: '25 min',
    description: 'Get started with React Native and build your first mobile component.',
    skills: ['React Native', 'JavaScript', 'Mobile Dev'],
    skillGains: { 'React Native': 15, 'JavaScript': 10, 'Mobile Dev': 10 },
    steps: [
      {
        id: 'step-1',
        title: 'Set up your environment',
        content: 'Install Node.js, Expo CLI, and set up your first React Native project.',
        type: 'link',
        link: 'https://reactnative.dev/docs/environment-setup',
      },
      {
        id: 'step-2',
        title: 'Create a simple component',
        content: 'Build a button component with custom styling.',
        type: 'code',
        codeSnippet: `import { TouchableOpacity, Text, StyleSheet } from 'react-native';\n\nconst CustomButton = ({ title, onPress }) => (\n  <TouchableOpacity style={styles.button} onPress={onPress}>\n    <Text style={styles.text}>{title}</Text>\n  </TouchableOpacity>\n);`,
      },
      {
        id: 'step-3',
        title: 'Add interactivity',
        content: 'Implement state management using useState hook.',
        type: 'task',
      },
    ],
    tips: [
      'Use StyleSheet.create for optimized styling',
      'Test on both iOS and Android simulators',
      'Learn the difference between View and ScrollView',
    ],
  },
  {
    id: 'ai-1',
    title: 'Introduction to AI Prompting',
    category: 'ai-ml',
    difficulty: 'beginner',
    duration: '15 min',
    description: 'Master the art of crafting effective AI prompts for better results.',
    skills: ['AI', 'Prompt Engineering', 'Critical Thinking'],
    skillGains: { 'AI': 10, 'Prompt Engineering': 15, 'Critical Thinking': 5 },
    steps: [
      {
        id: 'step-1',
        title: 'Understand prompt structure',
        content: 'Learn the key components: context, instruction, constraints, and format.',
        type: 'text',
      },
      {
        id: 'step-2',
        title: 'Practice with examples',
        content: 'Try different prompt styles and compare results.',
        type: 'task',
      },
      {
        id: 'step-3',
        title: 'Learn advanced techniques',
        content: 'Explore few-shot learning, chain-of-thought, and role-playing.',
        type: 'link',
        link: 'https://www.anthropic.com/index/prompt-engineering',
      },
    ],
    tips: [
      'Be specific and clear in your instructions',
      'Provide examples for better results',
      'Iterate and refine based on output',
    ],
  },
  {
    id: 'ent-1',
    title: 'Validate Your Business Idea',
    category: 'entrepreneurship',
    difficulty: 'beginner',
    duration: '30 min',
    description: 'Learn how to test and validate your startup idea before building.',
    skills: ['Business', 'Market Research', 'Critical Thinking'],
    skillGains: { 'Business': 15, 'Market Research': 15, 'Critical Thinking': 10 },
    steps: [
      {
        id: 'step-1',
        title: 'Define your target customer',
        content: 'Create a detailed customer persona including demographics, pain points, and behaviors.',
        type: 'text',
      },
      {
        id: 'step-2',
        title: 'Conduct customer interviews',
        content: 'Talk to at least 10 potential customers to understand their needs.',
        type: 'task',
      },
      {
        id: 'step-3',
        title: 'Create a value proposition',
        content: 'Clearly articulate how your solution solves their problem.',
        type: 'text',
      },
      {
        id: 'step-4',
        title: 'Build a landing page',
        content: 'Test demand with a simple landing page and track sign-ups.',
        type: 'task',
      },
    ],
    tips: [
      'Focus on the problem, not your solution',
      'Listen more than you talk in interviews',
      'Validate with real money or commitments, not just interest',
    ],
  },
  {
    id: 'data-1',
    title: 'Data Visualization with Python',
    category: 'data-science',
    difficulty: 'intermediate',
    duration: '35 min',
    description: 'Create compelling data visualizations using matplotlib and seaborn.',
    skills: ['Python', 'Data Viz', 'Analytics'],
    skillGains: { 'Python': 10, 'Data Viz': 20, 'Analytics': 10 },
    steps: [
      {
        id: 'step-1',
        title: 'Install required libraries',
        content: 'Set up your Python environment with pandas, matplotlib, and seaborn.',
        type: 'code',
        codeSnippet: `pip install pandas matplotlib seaborn`,
      },
      {
        id: 'step-2',
        title: 'Load and explore data',
        content: 'Import a dataset and perform basic exploratory analysis.',
        type: 'task',
      },
      {
        id: 'step-3',
        title: 'Create your first chart',
        content: 'Build a bar chart or line plot to visualize trends.',
        type: 'code',
        codeSnippet: `import matplotlib.pyplot as plt\nimport seaborn as sns\n\nsns.set_style('darkgrid')\nplt.figure(figsize=(10, 6))\nsns.lineplot(data=df, x='date', y='value')\nplt.title('Trend Over Time')\nplt.show()`,
      },
    ],
    tips: [
      'Choose the right chart type for your data',
      'Use color strategically to highlight insights',
      'Always label your axes and add a title',
    ],
  },
];

export const getChallenge = (id: string): Challenge | undefined => {
  return CHALLENGES.find(c => c.id === id);
};

export const getChallengesByCategory = (categoryId: string): Challenge[] => {
  return CHALLENGES.filter(c => c.category === categoryId);
};

export const getChallengesByInterests = (interests: string[]): Challenge[] => {
  return CHALLENGES.filter(c => interests.includes(c.category));
};