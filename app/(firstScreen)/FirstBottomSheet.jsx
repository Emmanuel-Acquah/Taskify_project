import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FirstBottomSheet = ({ name, email, onClearUserLists ,onClearGroup}) => {
  const handleClearUserLists = () => {
    Alert.alert(
      "Clear All Lists",
      "Are you sure you want to clear all user lists? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userLists");
              onClearUserLists(); // Callback to update parent state
              console.log("User lists cleared successfully");
            } catch (error) {
              console.error("Error clearing user lists:", error);
            }
          },
        },
      ]
    );
  };
  const handleClearGroup = () => {
    Alert.alert(
      "Clear All Groups",
      "Are you sure you want to clear all Groups This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("customGroups");
              onClearGroup(); // Callback to update parent state
              console.log("User lists cleared successfully");
            } catch (error) {
              console.error("Error clearing user lists:", error);
            }
          },
        },
      ]
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://images.pexels.com/photos/12715153/pexels-photo-12715153.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
            }}
          />
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        {/* Manage Accounts */}
        <View style={styles.card}>
          <TouchableOpacity>
            <Text style={styles.cardText}>Manage Accounts</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>General</Text>
        </View>
        <Pressable style={styles.dangerOption} onPress={handleClearUserLists}>
          <Text style={styles.dangerText}>Clear All Lists</Text>
        </Pressable>
        <Pressable style={styles.dangerOption} onPress={handleClearGroup}>
          <Text style={styles.dangerText}>Clear Groups</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  doneText: {
    fontSize: 16,
    color: "#007AFF",
  },
  scrollContent: {
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dangerOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  dangerText: {
    fontSize: 17,
    color: "#FF3B30", // Red color for destructive action
  },
});

export default FirstBottomSheet;
