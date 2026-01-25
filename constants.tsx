
import { Language, Scenario, ProficiencyLevel } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', welcomeMessage: "Let's practice your English!" },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', welcomeMessage: "¡Practiquemos tu español!" },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', welcomeMessage: "Pratiquons votre français !" },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', welcomeMessage: "Lass uns dein Deutsch üben!" },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱', welcomeMessage: "Laten we je Nederlands oefenen!" },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', welcomeMessage: "日本語の練習をしましょう！" },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', welcomeMessage: "让我们练习你的中文！" },
  { code: 'la-VA', name: 'Latin', flag: '🏛️', welcomeMessage: "Latine loquāmur! (Let's speak Latin!)"},
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'cafe',
    title: 'Ordering at a Cafe',
    description: 'Practice ordering coffee and pastries in a natural setting.',
    instruction: 'Act as a friendly barista. Greet the customer and help them order. Ask for their name and preferred milk or sugar.',
    icon: '☕',
  },
  {
    id: 'interview',
    title: 'Job Interview',
    description: 'Prepare for professional conversations and career questions.',
    instruction: 'Act as a professional hiring manager for a tech company. Ask relevant questions about experience and goals.',
    icon: '💼',
  },
  {
    id: 'travel',
    title: 'Asking for Directions',
    description: 'Learn how to navigate a new city and ask locals for help.',
    instruction: 'Act as a helpful local resident. Someone is lost and asking for the nearest train station or landmark.',
    icon: '🗺️',
  },
  {
    id: 'casual',
    title: 'Casual Chat',
    description: 'Freestyle conversation about hobbies, movies, and life.',
    instruction: 'Act as a friendly peer or language exchange partner. Keep the conversation light and engaging.',
    icon: '🤝',
  },
];

export const LEVELS: { value: ProficiencyLevel; label: string; icon: string; description: string }[] = [
  { 
    value: 'Beginning', 
    label: 'Beginning', 
    icon: '🌱', 
    description: 'Slow speech, simple words, and lots of patience.' 
  },
  { 
    value: 'Intermediate', 
    label: 'Intermediate', 
    icon: '🌿', 
    description: 'Natural speed with clear articulation and standard vocabulary.' 
  },
  { 
    value: 'Advanced', 
    label: 'Advanced', 
    icon: '🌳', 
    description: 'Fast, native-like flow with idioms and complex sentence structures.' 
  },
];
