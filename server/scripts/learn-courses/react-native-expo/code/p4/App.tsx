import { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Weather, fetchWeather } from "./weather";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ok"; weather: Weather };

export default function App() {
  const [city, setCity] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const search = async () => {
    if (!city.trim()) return;
    setState({ kind: "loading" });
    try {
      const weather = await fetchWeather(city.trim());
      setState({ kind: "ok", weather });
    } catch (e) {
      setState({ kind: "error", message: (e as Error).message });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Weather</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="City"
          onSubmitEditing={search}
          returnKeyType="search"
        />
        <Pressable style={styles.button} onPress={search}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>

      {state.kind === "loading" && <ActivityIndicator size="large" style={styles.gap} />}
      {state.kind === "error" && <Text style={[styles.gap, styles.error]}>{state.message}</Text>}
      {state.kind === "ok" && (
        <View style={styles.card}>
          <Text style={styles.city}>
            {state.weather.city}, {state.weather.country}
          </Text>
          <Text style={styles.temp}>{Math.round(state.weather.temperature)}°C</Text>
          <Text style={styles.desc}>{state.weather.description}</Text>
          <Text style={styles.wind}>Wind {state.weather.windSpeed} km/h</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8 },
  input: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 12, fontSize: 16, borderWidth: 1, borderColor: "#d0d4dc" },
  button: { backgroundColor: "#3b5bdb", justifyContent: "center", paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "600" },
  gap: { marginTop: 32 },
  error: { color: "#c92a2a", textAlign: "center" },
  card: { marginTop: 24, padding: 20, borderRadius: 14, backgroundColor: "#fff", alignItems: "center" },
  city: { fontSize: 22, fontWeight: "600" },
  temp: { fontSize: 56, fontWeight: "700", marginVertical: 8 },
  desc: { fontSize: 18 },
  wind: { color: "#555", marginTop: 6 },
});
