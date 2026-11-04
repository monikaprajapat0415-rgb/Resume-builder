import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { questions } from "../src/questions";

export default function Quiz() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = questions[index];
  const last = index === questions.length - 1;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (last) {
      router.replace({ pathname: "/result", params: { score: String(score), total: String(questions.length) } });
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.count}>
        Question {index + 1} of {questions.length}
      </Text>
      <Text style={styles.question}>{q.text}</Text>
      {q.options.map((opt, i) => {
        const state = picked === null ? "" : i === q.answer ? "right" : i === picked ? "wrong" : "";
        return (
          <Pressable
            key={opt}
            onPress={() => choose(i)}
            style={[styles.option, state === "right" && styles.right, state === "wrong" && styles.wrong]}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        );
      })}
      {picked !== null && (
        <Pressable style={styles.next} onPress={next}>
          <Text style={styles.nextText}>{last ? "See result" : "Next"}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24 },
  count: { color: "#555", marginBottom: 8 },
  question: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  option: { padding: 14, borderRadius: 10, backgroundColor: "#e9ecef", marginBottom: 10 },
  optionText: { fontSize: 16 },
  right: { backgroundColor: "#b2f2bb" },
  wrong: { backgroundColor: "#ffc9c9" },
  next: { marginTop: 16, backgroundColor: "#3b5bdb", padding: 14, borderRadius: 10, alignItems: "center" },
  nextText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
