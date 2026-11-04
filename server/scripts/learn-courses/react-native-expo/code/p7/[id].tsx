import { ScrollView, View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMeal } from "../src/api";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => getMeal(id),
    enabled: !!id,
  });

  if (isLoading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (isError || !data) return <Text style={styles.error}>{(error as Error)?.message ?? "Something went wrong"}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: data.thumb }} style={styles.image} />
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.meta}>{data.category} · {data.area}</Text>
      <Text style={styles.heading}>Ingredients</Text>
      {data.ingredients.map((i) => (
        <Text key={i} style={styles.text}>• {i}</Text>
      ))}
      <Text style={styles.heading}>Instructions</Text>
      <Text style={styles.text}>{data.instructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  image: { width: "100%", height: 240, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: "700", marginTop: 12 },
  meta: { color: "#666", marginBottom: 8 },
  heading: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 6 },
  text: { fontSize: 15, lineHeight: 22 },
  error: { color: "#c92a2a", textAlign: "center", marginTop: 40 },
});
