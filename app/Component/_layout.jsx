import { Text, View, SafeAreaProvider, SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ListsProvider } from "../context.jsx/ListContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ComponentLayout = () => {
  return (
    <ListsProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="searchScreen" option={{ HeadersShown: true }} />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </ListsProvider>
  );
};

export default ComponentLayout;
