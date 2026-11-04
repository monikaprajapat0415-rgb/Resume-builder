import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Entry = { id: string; caption: string; uri: string; createdAt: number };
const KEY = "journal.v1";
const DIR = (FileSystem.documentDirectory ?? "") + "photos/";

export async function loadEntries(): Promise<Entry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Entry[]) : [];
}

export async function addEntry(sourceUri: string, caption: string): Promise<Entry[]> {
  await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  const id = Date.now().toString();
  const target = `${DIR}${id}.jpg`;
  await FileSystem.copyAsync({ from: sourceUri, to: target });
  const entries = [{ id, caption, uri: target, createdAt: Date.now() }, ...(await loadEntries())];
  await AsyncStorage.setItem(KEY, JSON.stringify(entries));
  return entries;
}

export async function removeEntry(id: string): Promise<Entry[]> {
  const entries = await loadEntries();
  const gone = entries.find((e) => e.id === id);
  if (gone) await FileSystem.deleteAsync(gone.uri, { idempotent: true });
  const left = entries.filter((e) => e.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(left));
  return left;
}
