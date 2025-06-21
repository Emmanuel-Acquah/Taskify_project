import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";

const Planned = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [activeTab, setActiveTab] = useState("Later");
  const navigation = useNavigation();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const swipeableRefs = useRef({});

  const handleAddTask = () => {
    if (task.trim() !== "") {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        showCompletedText: false,
        dueDate: activeTab === "Later" ? null : new Date().toISOString(),
      };
      setTaskList([...taskList, newTask]);
      setTask("");
    }
  };

  const handleDeleteTask = (id) => {
    swipeableRefs.current[id]?.close();
    setTaskList((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleTaskCompletion = (id) => {
    const newList = taskList.map((item) => {
      if (item.id === id) {
        const wasCompleted = item.completed;
        const updatedItem = {
          ...item,
          completed: !wasCompleted,
          showCompletedText: !wasCompleted,
        };

        if (!wasCompleted) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              fadeAnim.setValue(0);
              setTaskList((prev) =>
                prev.map((i) =>
                  i.id === id ? { ...i, showCompletedText: false } : i
                )
              );
            }, 1000);
          });
        }
        return updatedItem;
      }
      return item;
    });
    setTaskList(newList);
  };

  const renderRightActions = (progress, dragX, id) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <View style={styles.rightActionContainer}>
        <Animated.View
          style={[styles.rightAction, { transform: [{ translateX: trans }] }]}
        >
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDeleteTask(id)}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable
      ref={(ref) => (swipeableRefs.current[item.id] = ref)}
      friction={2}
      rightThreshold={40}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item.id)
      }
      onSwipeableWillOpen={() => {
        Object.keys(swipeableRefs.current).forEach((key) => {
          if (key !== item.id && swipeableRefs.current[key]) {
            swipeableRefs.current[key].close();
          }
        });
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("TaskDetails", { task: item })}
        style={styles.taskItem}
        activeOpacity={0.7}
      >
        <View style={styles.taskLeft}>
          <Checkbox
            value={item.completed}
            onValueChange={() => toggleTaskCompletion(item.id)}
            style={styles.checkbox}
          />
          <Text
            style={[
              styles.taskText,
              item.completed && styles.completedTaskText,
            ]}
          >
            {item.text}
          </Text>
        </View>
        {item.showCompletedText && (
          <Animated.View style={[styles.completedPopup, { opacity: fadeAnim }]}>
            <Text style={styles.completedPopupText}>Completed!</Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
            <Text style={styles.backText}>Lists</Text>
          </Pressable>
          <Pressable style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </Pressable>
        </View>

        {/* Title */}
        <Text style={styles.title}>Planned</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === "Later" && styles.activeTab]}
            onPress={() => setActiveTab("Later")}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={activeTab === "Later" ? "#2F80ED" : "#666"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Later" && styles.activeTabText,
              ]}
            >
              Later
            </Text>
          </Pressable>
        </View>

        {/* Task List */}
        <FlatList
          data={taskList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Tasks with due dates or reminders show up here.
              </Text>
            </View>
          }
        />

        {/* Add Task Input */}
        <View style={styles.inputContainer}>
          <Pressable onPress={handleAddTask} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#2F80ED" />
          </Pressable>
          <TextInput
            placeholder="Add a task"
            value={task}
            onChangeText={setTask}
            onSubmitEditing={handleAddTask}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
  },
  menuButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 15,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#2F80ED",
  },
  tabText: {
    marginLeft: 5,
    color: "#666",
  },
  activeTabText: {
    color: "#2F80ED",
    fontWeight: "600",
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#999",
  },
  taskItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    marginRight: 12,
    width: 20,
    height: 20,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  rightActionContainer: {
    width: 80,
    flexDirection: "row",
  },
  rightAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff3b30",
  },
  deleteButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  completedPopup: {
    position: "absolute",
    right: 50,
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  completedPopupText: {
    color: "white",
    fontSize: 12,
  },
});

export default Planned;
