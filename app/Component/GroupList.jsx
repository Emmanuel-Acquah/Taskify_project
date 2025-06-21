import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GroupList = ({ groupName, onBack }) => {
  const [tasks, setTasks] = useState([
    { id: "1", text: "Untitled list", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
      setIsAddingTask(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTasks(tasks.filter((task) => task.id !== id)),
      },
    ]);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Pressable onPress={() => toggleTask(item.id)} style={styles.taskLeft}>
        <View
          style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
        >
          {item.completed && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
        <Text
          style={[styles.taskText, item.completed && styles.taskTextCompleted]}
        >
          {item.text}
        </Text>
      </Pressable>
      <Pressable onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Lists</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{groupName}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tasks List */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
      />

      {/* Add Task Section */}
      <View style={styles.addTaskSection}>
        {isAddingTask ? (
          <View style={styles.addTaskInput}>
            <TextInput
              style={styles.input}
              value={newTaskText}
              onChangeText={setNewTaskText}
              placeholder="New task"
              placeholderTextColor="#8E8E93"
              autoFocus
              onSubmitEditing={addTask}
              onBlur={() => {
                if (!newTaskText.trim()) {
                  setIsAddingTask(false);
                }
              }}
            />
            <Pressable onPress={addTask} style={styles.addButton}>
              <Ionicons name="checkmark" size={20} color="#007AFF" />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsAddingTask(true)}
            style={styles.addTaskButton}
          >
            <Ionicons name="add" size={24} color="#007AFF" />
            <Text style={styles.addTaskText}>Add Task</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#007AFF",
    fontSize: 17,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  headerRight: {
    width: 60, // Placeholder for spacing
  },
  taskList: {
    flex: 1,
    backgroundColor: "white",
  },
  taskListContent: {
    paddingVertical: 8,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  taskText: {
    fontSize: 17,
    color: "#000",
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  addTaskSection: {
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addTaskText: {
    color: "#007AFF",
    fontSize: 17,
    marginLeft: 8,
  },
  addTaskInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#000",
    paddingVertical: 8,
  },
  addButton: {
    padding: 4,
  },
});

export default GroupList;
