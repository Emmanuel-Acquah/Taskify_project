import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../context.jsx/Themecontext";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = 60;

const ThemePicker = () => {
  const { currentTheme, setCurrentTheme } = useTheme();
  const [selectedTab, setSelectedTab] = React.useState("Colour");

  const colorThemes = [
    { id: "blue", color: "#6366F1" },
    { id: "purple", color: "#8B5CF6" },
    { id: "pink", color: "#EC4899" },
    { id: "red", color: "#EF4444" },
    { id: "green", color: "#22C55E" },
    { id: "teal", color: "#14B8A6" },
    { id: "gray", color: "#6B7280" },
    { id: "white", color: "#FFFFFF", borderColor: "#E5E5EA" },
  ];

  const photoThemes = [
    {
      id: "nature1",
      uri: "https://images.pexels.com/photos/32525175/pexels-photo-32525175.jpeg",
    },
    {
      id: "nature2",
      uri: "https://images.pexels.com/photos/32192165/pexels-photo-32192165.jpeg",
    },
  ];

  const handleBack = () => {
    router.replace('/(firstScreen)/ListOption'); // Goes back to ListOption
  };

  const handleDone = () => {
    router.replace(".."); // Goes back to NewList
  };

  const handleThemeSelect = (theme) => {
    setCurrentTheme(theme);
  };

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={handleDone}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <View
                  style={{
                    width: 40,
                    height: 5,
                    backgroundColor: "grey",
                    alignSelf: "center",
                    marginTop: 5,
                    borderRadius: 2,
                  }}
                />
        <View style={styles.header}>
          
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Theme</Text>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "Colour" && styles.activeTab]}
            onPress={() => setSelectedTab("Colour")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Colour" && styles.activeTabText,
              ]}
            >
              Colour
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "Photo" && styles.activeTab]}
            onPress={() => setSelectedTab("Photo")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Photo" && styles.activeTabText,
              ]}
            >
              Photo
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.themesContainer}
          showsHorizontalScrollIndicator={false}
        >
          {selectedTab === "Colour"
            ? colorThemes.map((theme) => (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCircle,
                    { backgroundColor: theme.color },
                    currentTheme?.id === theme.id && styles.selectedCircle,
                  ]}
                  onPress={() => handleThemeSelect({ ...theme, type: "color" })}
                >
                  {currentTheme?.id === theme.id && (
                    <Ionicons name="checkmark" size={24} color="white" />
                  )}
                </TouchableOpacity>
              ))
            : photoThemes.map((theme) => (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCircle,
                    currentTheme?.id === theme.id && styles.selectedCircle,
                  ]}
                  onPress={() => handleThemeSelect({ ...theme, type: "photo" })}
                >
                  <Image
                    source={{ uri: theme.uri }}
                    style={styles.themeImage}
                  />
                  {currentTheme?.id === theme.id && (
                    <View style={styles.checkmarkContainer}>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    backgroundColor: "#F2F2F7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  doneButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  activeTabText: {
    color: "white",
  },
  themesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  themeCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCircle: {
    borderColor: "#007AFF",
  },
  themeImage: {
    width: "100%",
    height: "100%",
    borderRadius: CIRCLE_SIZE / 2,
  },
  checkmarkContainer: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#34C759",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ThemePicker;
