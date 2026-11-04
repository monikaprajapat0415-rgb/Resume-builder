import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Result() {
  const { score, total } = useLocalSearchParams<{ score: string; total: string }>();
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>
        You scored {score} out of {total}
      </Text>
      <Pressable style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Play again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 24 },
  button: { backgroundColor: "#3b5bdb", paddingVertical: 14, paddingHorizontal: 36, borderRadius: 12 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
