import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const client = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } });

export default function Layout() {
  return (
    <QueryClientProvider client={client}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Recipes" }} />
        <Stack.Screen name="[id]" options={{ title: "Recipe" }} />
      </Stack>
    </QueryClientProvider>
  );
}
