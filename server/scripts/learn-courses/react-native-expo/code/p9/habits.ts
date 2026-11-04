import AsyncStorage from "@react-native-async-storage/async-storage";

export type Habit = { id: string; name: string; doneDates: string[] };
const KEY = "habits.v1";

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Counts consecutive days ending today (or yesterday if today is not done yet).
export function streak(doneDates: string[], today = new Date()): number {
  const set = new Set(doneDates);
  const cursor = new Date(today);
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(dayKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export async function loadHabits(): Promise<Habit[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Habit[]) : [];
}

export const saveHabits = (h: Habit[]) => AsyncStorage.setItem(KEY, JSON.stringify(h));
