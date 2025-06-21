import { StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import {Stack} from "expo-router"
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeProvider } from "../context.jsx/Themecontext";
export default function TaskLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyDay" />
        <Stack.Screen name="Planned" />
        <Stack.Screen name="Important" />
        <Stack.Screen name="flag" />
        <Stack.Screen name="Assigned" />
        <Stack.Screen name="All" />
        <Stack.Screen name="Task" />
        <Stack.Screen name="NewList" />
        <Stack.Screen name="ListsOption" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
   
}

const styles = StyleSheet.create({})