import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { Todo, loadTodos, saveTodos } from "./storage";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadTodos().then((t) => {
      setTodos(t);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveTodos(todos);
  }, [todos, ready]);

  const add = () => {
    const title = text.trim();
    if (!title) return;
    setTodos((prev) => [{ id: Date.now().toString(), title, done: false }, ...prev]);
    setText("");
  };
  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  const left = todos.filter((t) => !t.done).length;

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>To-Do</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.grow]}
          value={text}
          onChangeText={setText}
          placeholder="New task"
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <Pressable style={styles.add} onPress={add}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <Text style={styles.count}>
        {left} left, {todos.length - left} done
      </Text>

      <FlatList
        data={todos}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={<Text style={styles.empty}>Nothing to do. Add your first task above.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Pressable style={styles.grow} onPress={() => toggle(item.id)}>
              <Text style={[styles.itemText, item.done && styles.done]}>
                {item.done ? "☑ " : "☐ "}
                {item.title}
              </Text>
            </Pressable>
            <Pressable onPress={() => remove(item.id)}>
              <Text style={styles.del}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      {todos.some((t) => t.done) && (
        <Pressable onPress={clearDone}>
          <Text style={styles.clear}>Clear finished tasks</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  grow: { flex: 1 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: "#d0d4dc" },
  add: { backgroundColor: "#3b5bdb", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  addText: { color: "#fff", fontWeight: "600" },
  count: { marginVertical: 12, color: "#555" },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 8 },
  itemText: { fontSize: 16 },
  done: { textDecorationLine: "line-through", color: "#999" },
  del: { color: "#d6336c" },
  clear: { textAlign: "center", color: "#3b5bdb", padding: 12 },
});
