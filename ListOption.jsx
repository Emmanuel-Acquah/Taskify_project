import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ListOption = ({}) => {
  const handleOptionPress = (option) => {
    console.log(`${option} pressed`);
  };
  const handleRenameList = () => {
    // Go back to NewList screen with a flag to focus the title input
    router.back();
    // Use a timeout to ensure the screen has loaded before focusing
    setTimeout(() => {
      // You can use router.setParams or a global state to trigger focus
      router.setParams({
        focusTitle: "true",
        timestamp: Date.now().toString(),
      });
    }, 100);
  };

  const handleChangeTheme = () => {
    router.replace("/(firstScreen)/ThemePicker");
  };
  const handleChangeSort = () => {
    router.replace("/(firstScreen)/Sort");
  };

  const handleDismiss = () => {
    router.back();
  };

  const OptionItem = ({
    iconName,
    title,
    onPress,
    isDestructive = false,
    hasChevron = false,
  }) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionContent}>
        <Ionicons
          name={iconName}
          size={24}
          color={isDestructive ? "#FF3B30" : "#333"}
          style={styles.icon}
        />
        <Text
          style={[styles.optionText, isDestructive && styles.destructiveText]}
        >
          {title}
        </Text>
      </View>
      {hasChevron && (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={handleDismiss}>
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
          <View/>
          <Text style={styles.headerTitle}>List Options</Text>
          <TouchableOpacity onPress={handleDismiss}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.optionsList}>
            <OptionItem
              iconName="create-outline"
              title="Rename List"
              onPress={handleRenameList}
            />
            <OptionItem
              iconName="folder-outline"
              title="Move List to..."
              onPress={() => handleOptionPress("Move List")}
              hasChevron
            />
            <OptionItem
              iconName="list-outline"
              title="Sort"
              onPress={handleChangeSort}
              hasChevron
            />
            <OptionItem
              iconName="color-palette-outline"
              title="Change Theme"
              onPress={handleChangeTheme}
              hasChevron
            />
            <OptionItem
              iconName="copy-outline"
              title="Duplicate List"
              onPress={() => handleOptionPress("Duplicate List")}
            />
            <OptionItem
              iconName="trash-outline"
              title="Delete List"
              onPress={() => handleOptionPress("Delete List")}
              isDestructive
            />
          </View>
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
    backgroundColor: "#FFFFFF",
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
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingLeft:50
  },
  doneButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  optionsList: {
    backgroundColor: "#FFFFFF",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  destructiveText: {
    color: "#FF3B30",
  },
});

export default ListOption;
