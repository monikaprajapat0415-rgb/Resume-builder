import { useState } from "react";
import { View, Text, TextInput, FlatList, Image, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { searchMeals } from "../src/api";

export default function Search() {
  const router = useRouter();
  const [text, setText] = useState("chicken");
  const [term, setTerm] = useState("chicken");

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["meals", term],
    queryFn: () => searchMeals(term),
  });

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Search recipes"
        returnKeyType="search"
        onSubmitEditing={() => setTerm(text.trim())}
      />
      {isLoading && <ActivityIndicator size="large" style={{ marginTop: 32 }} />}
      {isError && <Text style={styles.error}>{(error as Error).message}</Text>}
      <FlatList
        data={data ?? []}
        keyExtractor={(m) => m.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={!isLoading && !isError ? <Text style={styles.empty}>No recipes found.</Text> : null}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/${item.id}`)}>
            <Image source={{ uri: item.thumb }} style={styles.thumb} />
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#d0d4dc", marginBottom: 12 },
  error: { color: "#c92a2a", textAlign: "center", marginTop: 20 },
  empty: { textAlign: "center", color: "#888", marginTop: 30 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, marginBottom: 10, overflow: "hidden" },
  thumb: { width: 80, height: 80 },
  name: { flex: 1, padding: 12, fontSize: 16, fontWeight: "500" },
});
