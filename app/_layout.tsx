import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./globals.css";

/**
 * The root layout of the app.
 *
 * This component is the topmost component in the app and is responsible for
 * rendering the navigation stack.
 *
 * The navigation stack contains two screens:
 * - The `(tabs)` screen, which is the main home screen of the app and is a
 *   bottom tab navigator.
 * - The `movies/[id]` screen, which is a detail screen for a movie.
 *
 * The `StatusBar` hides the time and battery percentage on the device.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
