import { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Switch, Pressable, StyleSheet } from "react-native";
import { calculateTip, money } from "./tip";

export default function App() {
  const [billText, setBillText] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(1);
  const [roundUp, setRoundUp] = useState(false);

  const bill = parseFloat(billText) || 0;
  const result = calculateTip(bill, tipPercent, people, roundUp);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Tip Calculator</Text>

      <Text style={styles.label}>Bill amount</Text>
      <TextInput
        style={styles.input}
        value={billText}
        onChangeText={setBillText}
        keyboardType="decimal-pad"
        placeholder="0.00"
      />

      <Text style={styles.label}>Tip: {tipPercent}%</Text>
      <View style={styles.row}>
        {[10, 15, 20, 25].map((p) => (
          <Pressable
            key={p}
            onPress={() => setTipPercent(p)}
            style={[styles.chip, p === tipPercent && styles.chipOn]}
          >
            <Text style={p === tipPercent ? styles.chipTextOn : styles.chipText}>{p}%</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, styles.grow]}>People: {people}</Text>
        <Pressable style={styles.round} onPress={() => setPeople(Math.max(1, people - 1))}>
          <Text style={styles.roundText}>-</Text>
        </Pressable>
        <Pressable style={styles.round} onPress={() => setPeople(people + 1)}>
          <Text style={styles.roundText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, styles.grow]}>Round tip up</Text>
        <Switch value={roundUp} onValueChange={setRoundUp} />
      </View>

      <View style={styles.card}>
        <Text style={styles.line}>Tip: {money(result.tip)}</Text>
        <Text style={styles.line}>Total: {money(result.total)}</Text>
        <Text style={styles.big}>Each person pays {money(result.perPerson)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 16, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, fontSize: 18, borderWidth: 1, borderColor: "#d0d4dc" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  grow: { flex: 1 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#e3e6ee" },
  chipOn: { backgroundColor: "#3b5bdb" },
  chipText: { color: "#222" },
  chipTextOn: { color: "#fff", fontWeight: "600" },
  round: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#3b5bdb", alignItems: "center", justifyContent: "center" },
  roundText: { color: "#fff", fontSize: 20 },
  card: { marginTop: 24, padding: 16, borderRadius: 12, backgroundColor: "#fff" },
  line: { fontSize: 16, marginBottom: 4 },
  big: { fontSize: 20, fontWeight: "700", marginTop: 8 },
});
