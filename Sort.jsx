import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function sort() {
  const handleDone = () => {
    router.back();
  };
  const handleImportance = () => {
    console.log("done");
  };
  const hanldeAlpha = () => {
    console.log("done");
  };
  const hanldeDueDate = () => {
    console.log("done");
  };
  const hanldeAddMyDay = () => {
    console.log("done");
  };
  const handleBack = () => {
    router.replace("/(firstScreen)/ListOption"); // Goes back to ListOption
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
          <Text style={styles.headerTitle}>Sort</Text>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.optionsList}>
            <OptionItem
              iconName="star-otline"
              title="Importance"
              onPress={handleImportance}
            />
            <OptionItem
              iconName="swap-vertical-outline"
              title="Alphabetically"
              onPress={hanldeAlpha}
            />
            <OptionItem
              iconName="calendar-outline"
              title="Due Date"
              onPress={hanldeDueDate}
            />
            <OptionItem
              iconName="sunny-otline"
              title="Change Theme"
              onPress={hanldeAddMyDay}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

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
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingLeft:25
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
