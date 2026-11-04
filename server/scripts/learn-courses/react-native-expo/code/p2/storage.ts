import AsyncStorage from "@react-native-async-storage/async-storage";

export type Todo = { id: string; title: string; done: boolean };
const KEY = "todos.v1";

export async function loadTodos(): Promise<Todo[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(todos));
}
