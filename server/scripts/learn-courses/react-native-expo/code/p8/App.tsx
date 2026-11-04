import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Image, Pressable, FlatList, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Entry, addEntry, loadEntries, removeEntry } from "./journal";

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    loadEntries().then(setEntries);
  }, []);

  const add = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow access in Settings to add photos.");
      return;
    }
    const launch = fromCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await launch({ mediaTypes: ["images"], quality: 0.7 });
    if (result.canceled) return;
    setEntries(await addEntry(result.assets[0].uri, caption.trim() || "Untitled"));
    setCaption("");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Photo Journal</Text>
      <TextInput style={styles.input} value={caption} onChangeText={setCaption} placeholder="Caption for the next photo" />
      <View style={styles.row}>
        <Pressable style={styles.button} onPress={() => add(false)}>
          <Text style={styles.buttonText}>Choose photo</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => add(true)}>
          <Text style={styles.buttonText}>Take photo</Text>
        </Pressable>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        ListEmptyComponent={<Text style={styles.empty}>No photos yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.caption}>{item.caption}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Pressable onPress={async () => setEntries(await removeEntry(item.id))}>
                <Text style={styles.del}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#d0d4dc" },
  row: { flexDirection: "row", gap: 8, marginVertical: 12 },
  button: { flex: 1, backgroundColor: "#3b5bdb", padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#888", marginTop: 30 },
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 12, overflow: "hidden" },
  photo: { width: "100%", height: 200 },
  cardRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  caption: { fontSize: 16, fontWeight: "500" },
  date: { color: "#777", marginTop: 2 },
  del: { color: "#d6336c" },
});
