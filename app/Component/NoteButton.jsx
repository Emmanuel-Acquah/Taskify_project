import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function NoteButton({ onCreateGroup }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("Untitled Group");

  const handleCancel = () => {
    setModalVisible(false);
    setInputValue("Untitled Group");
  };

  const handleCreate = () => {
    if (inputValue.trim()) {
      // Call the parent function to create the group
      onCreateGroup(inputValue.trim());

      Alert.alert("Success", `Group "${inputValue}" created!`);
      setModalVisible(false);
      setInputValue("Untitled Group");
    } else {
      Alert.alert("Error", "Please enter a group name");
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon Button to trigger modal */}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.iconButton}
      >
        <Ionicons name="duplicate-outline" size={24} color="#007AFF" />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <Text style={styles.title}>New Group</Text>

                {/* Text Input */}
                <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  autoFocus
                  selectTextOnFocus
                  placeholder="Group name"
                  placeholderTextColor="#8E8E93"
                />

                {/* Button Container */}
                <View style={styles.buttonContainer}>
                  <Pressable
                    onPress={handleCancel}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>

                  <View style={styles.buttonSeparator} />

                  <Pressable
                    onPress={handleCreate}
                    style={[styles.button, styles.createButton]}
                  >
                    <Text style={styles.createText}>Create</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconButton: {
    padding: 4,
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: "100%",
    justifyContent: "center",
    alignItems: "center",
    width:"70%",
    height : "100%",
    paddingBottom: 150
  },
  modalContent: {
    backgroundColor: "#F2F2F7",
    borderRadius: 14,
    width: "100%",
    maxWidth: 320,
    overflow: "hidden",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#F2F2F7",
    color: "#000",
  },
  input: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 17,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#C6C6C8",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
  },
  buttonSeparator: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#C6C6C8",
  },
  cancelButton: {
    // No additional styling needed
  },
  createButton: {
    // No additional styling needed
  },
  cancelText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "400",
  },
  createText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "600",
  },
});
