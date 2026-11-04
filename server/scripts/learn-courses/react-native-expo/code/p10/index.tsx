import { useState } from "react";
import { View, Text, Image, Pressable, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../src/api";
import { useCart } from "../src/cart";

export default function Shop() {
  const add = useCart((s) => s.add);
  const [category, setCategory] = useState<string | null>(null);
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  if (isLoading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (isError || !data)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Could not load products.</Text>
        <Pressable onPress={() => refetch()}>
          <Text style={styles.link}>Try again</Text>
        </Pressable>
      </View>
    );

  const categories = [...new Set(data.map((p) => p.category))];
  const shown = category ? data.filter((p) => p.category === category) : data;

  return (
    <View style={styles.screen}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(c) => c}
        style={styles.chips}
        ListHeaderComponent={
          <Pressable onPress={() => setCategory(null)} style={[styles.chip, category === null && styles.chipOn]}>
            <Text style={category === null ? styles.chipTextOn : undefined}>All</Text>
          </Pressable>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipOn]}>
            <Text style={category === item ? styles.chipTextOn : undefined}>{item}</Text>
          </Pressable>
        )}
      />
      <FlatList
        data={shown}
        numColumns={2}
        keyExtractor={(p) => String(p.id)}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <Text numberOfLines={2} style={styles.name}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Pressable style={styles.button} onPress={() => add(item)}>
              <Text style={styles.buttonText}>Add to cart</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "#c92a2a" },
  link: { color: "#3b5bdb", marginTop: 8 },
  chips: { flexGrow: 0, marginBottom: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: "#e3e6ee", marginRight: 6 },
  chipOn: { backgroundColor: "#3b5bdb" },
  chipTextOn: { color: "#fff" },
  card: { flex: 1, margin: 6, padding: 10, backgroundColor: "#fff", borderRadius: 12 },
  image: { height: 110, width: "100%" },
  name: { fontSize: 13, marginTop: 8, minHeight: 34 },
  price: { fontWeight: "700", marginVertical: 4 },
  button: { backgroundColor: "#3b5bdb", padding: 8, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 13 },
});
