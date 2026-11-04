import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, Switch, Alert, StyleSheet } from "react-native";
import { Habit, dayKey, loadHabits, saveHabits, streak } from "./habits";
import { cancelReminders, scheduleDailyReminder } from "./reminders";

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [remind, setRemind] = useState(false);
  const [ready, setReady] = useState(false);
  const today = dayKey(new Date());

  useEffect(() => {
    loadHabits().then((h) => {
      setHabits(h);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveHabits(habits);
  }, [habits, ready]);

  const add = () => {
    if (!name.trim()) return;
    setHabits((h) => [...h, { id: Date.now().toString(), name: name.trim(), doneDates: [] }]);
    setName("");
  };

  const toggleToday = (id: string) =>
    setHabits((h) =>
      h.map((x) =>
        x.id !== id
          ? x
          : {
              ...x,
              doneDates: x.doneDates.includes(today)
                ? x.doneDates.filter((d) => d !== today)
                : [...x.doneDates, today],
            }
      )
    );

  const toggleReminder = async (on: boolean) => {
    if (!on) {
      await cancelReminders();
      setRemind(false);
      return;
    }
    const ok = await scheduleDailyReminder(20, 0);
    if (!ok) Alert.alert("Notifications are off", "Allow notifications in Settings to get a daily reminder at 8 pm.");
    setRemind(ok);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Habits</Text>
      <View style={styles.row}>
        <Text style={styles.grow}>Daily reminder at 8 pm</Text>
        <Switch value={remind} onValueChange={toggleReminder} />
      </View>

      <View style={styles.row}>
        <TextInput style={[styles.input, styles.grow]} value={name} onChangeText={setName} placeholder="New habit" />
        <Pressable style={styles.add} onPress={add}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        ListEmptyComponent={<Text style={styles.empty}>Add a habit to start a streak.</Text>}
        renderItem={({ item }) => {
          const done = item.doneDates.includes(today);
          return (
            <View style={styles.card}>
              <View style={styles.grow}>
                <Text style={styles.habit}>{item.name}</Text>
                <Text style={styles.streak}>{streak(item.doneDates)} day streak</Text>
              </View>
              <Pressable style={[styles.done, done && styles.doneOn]} onPress={() => toggleToday(item.id)}>
                <Text style={done ? styles.doneTextOn : undefined}>{done ? "Done" : "Mark done"}</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  grow: { flex: 1 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#d0d4dc" },
  add: { backgroundColor: "#3b5bdb", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  addText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#888", marginTop: 30 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 8 },
  habit: { fontSize: 17, fontWeight: "600" },
  streak: { color: "#2b8a3e", marginTop: 2 },
  done: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: "#e3e6ee" },
  doneOn: { backgroundColor: "#2b8a3e" },
  doneTextOn: { color: "#fff", fontWeight: "600" },
});
