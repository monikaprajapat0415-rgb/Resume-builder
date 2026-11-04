import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, Modal, StyleSheet } from "react-native";
import { Note, deleteNote, listNotes, saveNote } from "./db";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Partial<Note> | null>(null);

  const refresh = useCallback(async () => setNotes(await listNotes(query)), [query]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = async () => {
    if (!editing?.title?.trim()) return;
    await saveNote({ id: editing.id, title: editing.title.trim(), body: editing.body ?? "" });
    setEditing(null);
    refresh();
  };

  const remove = async (id: number) => {
    await deleteNote(id);
    refresh();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Notes</Text>
      <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="Search notes" />

      <FlatList
        data={notes}
        keyExtractor={(n) => String(n.id)}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet. Tap + to add one.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => setEditing(item)} onLongPress={() => remove(item.id)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.cardBody}>{item.body}</Text>
          </Pressable>
        )}
      />

      <Pressable style={styles.fab} onPress={() => setEditing({ title: "", body: "" })}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
        <SafeAreaView style={styles.modal}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={editing?.title ?? ""}
            onChangeText={(t) => setEditing((e) => ({ ...e, title: t }))}
          />
          <TextInput
            style={[styles.input, styles.bodyInput]}
            placeholder="Write your note"
            multiline
            value={editing?.body ?? ""}
            onChangeText={(t) => setEditing((e) => ({ ...e, body: t }))}
          />
          <View style={styles.row}>
            <Pressable style={styles.secondary} onPress={() => setEditing(null)}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable style={styles.primary} onPress={save}>
              <Text style={styles.primaryText}>Save</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#d0d4dc" },
  bodyInput: { height: 220, textAlignVertical: "top" },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  card: { backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontSize: 17, fontWeight: "600" },
  cardBody: { color: "#555", marginTop: 4 },
  fab: { position: "absolute", right: 24, bottom: 32, width: 56, height: 56, borderRadius: 28, backgroundColor: "#3b5bdb", alignItems: "center", justifyContent: "center" },
  fabText: { color: "#fff", fontSize: 30 },
  modal: { flex: 1, padding: 20 },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  primary: { backgroundColor: "#3b5bdb", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  primaryText: { color: "#fff", fontWeight: "600" },
  secondary: { padding: 12 },
});
