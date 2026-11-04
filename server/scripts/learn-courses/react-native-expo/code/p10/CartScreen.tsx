import { View, Text, Image, Pressable, FlatList, StyleSheet } from "react-native";
import { cartTotal, useCart } from "../src/cart";

export default function CartScreen() {
  const { lines, add, decrease, remove, clear } = useCart();
  const total = cartTotal(lines);

  return (
    <View style={styles.screen}>
      <FlatList
        data={lines}
        keyExtractor={(l) => String(l.product.id)}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.product.image }} style={styles.image} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2}>{item.product.title}</Text>
              <Text style={styles.price}>${(item.product.price * item.qty).toFixed(2)}</Text>
            </View>
            <Pressable style={styles.qty} onPress={() => decrease(item.product.id)}><Text>-</Text></Pressable>
            <Text style={styles.qtyText}>{item.qty}</Text>
            <Pressable style={styles.qty} onPress={() => add(item.product)}><Text>+</Text></Pressable>
            <Pressable onPress={() => remove(item.product.id)}><Text style={styles.del}> ✕</Text></Pressable>
          </View>
        )}
      />
      {lines.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          <Pressable style={styles.checkout} onPress={clear}>
            <Text style={styles.checkoutText}>Place demo order</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 12 },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 8, gap: 8 },
  image: { width: 48, height: 48 },
  price: { fontWeight: "700", marginTop: 2 },
  qty: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#e3e6ee", alignItems: "center", justifyContent: "center" },
  qtyText: { minWidth: 18, textAlign: "center" },
  del: { color: "#d6336c" },
  footer: { paddingTop: 8 },
  total: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  checkout: { backgroundColor: "#2b8a3e", padding: 14, borderRadius: 10, alignItems: "center" },
  checkoutText: { color: "#fff", fontWeight: "600" },
});
