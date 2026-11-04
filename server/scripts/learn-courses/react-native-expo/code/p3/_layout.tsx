import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Quiz" }} />
      <Stack.Screen name="quiz" options={{ title: "Question", headerBackVisible: false }} />
      <Stack.Screen name="result" options={{ title: "Result", headerBackVisible: false }} />
    </Stack>
  );
}
