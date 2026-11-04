import { useMemo, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { CATEGORIES, Category, ExpenseProvider, useExpenses } from "./ExpenseContext";
import { asMoney, parseCents } from "./money";

function Screen() {
  const { state, dispatch } = useExpenses();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [error, setError] = useState("");

  const total = useMemo(() => state.items.reduce((s, e) => s + e.cents, 0), [state.items]);
  const byCategory = useMemo(() => {
    const map = new Map<Category, number>();
    state.items.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.cents));
    return [...map.entries()];
  }, [state.items]);

  const add = () => {
    const cents = parseCents(amount);
    if (!title.trim() || cents === null) {
      setError("Enter a title and an amount such as 12.50");
      return;
    }
    setError("");
    dispatch({ type: "add", item: { id: Date.now().toString(), title: title.trim(), cents, category } });
    setTitle("");
    setAmount("");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.total}>{asMoney(total)}</Text>
      <Text style={styles.sub}>Total spent</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="decimal-pad"
      />
      <View style={styles.chips}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, c === category && styles.chipOn]}>
            <Text style={c === category ? styles.chipTextOn : undefined}>{c}</Text>
          </Pressable>
        ))}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={add}>
        <Text style={styles.buttonText}>Add expense</Text>
      </Pressable>

      {byCategory.map(([c, cents]) => (
        <Text key={c} style={styles.summary}>
          {c}: {asMoney(cents)}
        </Text>
      ))}

      <FlatList
        data={state.items}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowSub}>{item.category}</Text>
            </View>
            <Text style={styles.rowAmount}>{asMoney(item.cents)}</Text>
            <Pressable onPress={() => dispatch({ type: "remove", id: item.id })}>
              <Text style={styles.del}>  ✕</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <Screen />
    </ExpenseProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  total: { fontSize: 44, fontWeight: "700" },
  sub: { color: "#555", marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#d0d4dc" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: "#e3e6ee" },
  chipOn: { backgroundColor: "#3b5bdb" },
  chipTextOn: { color: "#fff" },
  error: { color: "#c92a2a", marginBottom: 6 },
  button: { backgroundColor: "#3b5bdb", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "600" },
  summary: { color: "#333", marginBottom: 2 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 8 },
  rowTitle: { fontSize: 16, fontWeight: "500" },
  rowSub: { color: "#777" },
  rowAmount: { fontWeight: "700" },
  del: { color: "#d6336c", fontSize: 16 },
});
