import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { questions } from "../src/questions";

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>React Native Quiz</Text>
      <Text style={styles.sub}>{questions.length} questions</Text>
      <Pressable style={styles.button} onPress={() => router.push("/quiz")}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 30, fontWeight: "700" },
  sub: { marginVertical: 12, color: "#555" },
  button: { backgroundColor: "#3b5bdb", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
