import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native'


const ListsOption = () => {
    const navigation = useNavigation();
  const handleOptionPress = (option) => {
    console.log(`${option} pressed`);
    // Handle the option press here
  };

  const handleDone = () => {
    navigation.goBack()
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>List Options</Text>
        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        <OptionItem
          iconName="list-outline"
          title="Sort"
          onPress={() => handleOptionPress("Sort")}
          hasChevron={true}
        />

        <OptionItem
          iconName="color-palette-outline"
          title="Change Theme"
          onPress={() => handleOptionPress("Change Theme")}
          hasChevron={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F2F2F7",
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
  optionsList: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 15,
    width: 24,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
  destructiveText: {
    color: "#FF3B30",
  },
});

export default ListsOption;
