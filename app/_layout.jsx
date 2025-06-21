import { Stack } from "expo-router";
import { SafeAreaProvider , SafeAreaView} from "react-native-safe-area-context"

import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    
      
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
     
  
  );
}
