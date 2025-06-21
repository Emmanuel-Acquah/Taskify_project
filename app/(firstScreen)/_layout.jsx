import { Stack } from "expo-router";
import { ThemeProvider } from "../context.jsx/Themecontext";
import { ListsProvider } from "../context.jsx/ListContext";

const RootLayout = () => {
  return (
    <ListsProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="ListOption"
            options={{
              presentation: "transparentModal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="ThemePicker"
            options={{
              presentation: "transparentModal",
              animation: "none",
            }}
          />
          <Stack.Screen
            name="Sort"
            options={{
              presentation: "transparentModal",
              animation: "none",
            }}
          />
        </Stack>
      </ThemeProvider>
    </ListsProvider>
  );
};

export default RootLayout;
