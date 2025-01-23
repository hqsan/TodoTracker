import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return(
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false, title: "List" }} />
          <Stack.Screen name="edit" options={{ headerShown: false, title: "Modify List" }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
