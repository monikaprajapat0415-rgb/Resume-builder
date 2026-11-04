import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { cartCount, useCart } from "../src/cart";

const client = new QueryClient();

function CartLabel() {
  const count = useCart((s) => cartCount(s.lines));
  return <Text>Cart ({count})</Text>;
}

export default function Layout() {
  return (
    <QueryClientProvider client={client}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Shop", tabBarIcon: () => <Text>🛍</Text> }} />
        <Tabs.Screen name="cart" options={{ title: "Cart", tabBarLabel: () => <CartLabel />, tabBarIcon: () => <Text>🛒</Text> }} />
      </Tabs>
    </QueryClientProvider>
  );
}
