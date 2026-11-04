export type Question = { text: string; options: string[]; answer: number };

export const questions: Question[] = [
  { text: "Which company created React Native?", options: ["Google", "Meta", "Apple", "Microsoft"], answer: 1 },
  { text: "Which component shows a scrollable list efficiently?", options: ["View", "Text", "FlatList", "Image"], answer: 2 },
  { text: "Which hook keeps a value between renders?", options: ["useState", "useRouter", "useId", "useContext"], answer: 0 },
  { text: "What language is used with Expo in this course?", options: ["Java", "TypeScript", "Swift", "PHP"], answer: 1 },
];
