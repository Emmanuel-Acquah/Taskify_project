import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link } from "expo-router";

const MyDay = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [{ title: newTask, isDone: false }, ...prev]);
      setNewTask("");
    }
  };

  const handleDeleteTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTaskDone = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updatedTasks);
  };

  const handleTaskPress = (task) => {
    navigation.navigate("myDaydetails", { title: task.title });
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/32138887/pexels-photo-32138887/free-photo-of-swiss-urban-artwork-in-narrow-street-scene.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        }}
        resizeMode="cover"
        style={styles.background}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={0}
          >
            <View style={styles.overlay}>
              {/* Header */}
              <View style={styles.headerRow}>
                <Pressable
                  style={styles.backButton}
                  onPress={() => navigation.navigate("index")}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={27}
                    color="#fff"
                  />
                  <Text style={styles.backText}>List</Text>
                </Pressable>
                <View style={styles.headerIcons}>
                  <Link href="/ListsOption" asChild>
                    <Pressable>
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={24}
                        color="white"
                      />
                    </Pressable>
                  </Link>
                </View>
              </View>

              

              {/* Task List */}
              <FlatList
                data={filteredTasks}
                keyExtractor={(item, index) => `${item.title}-${index}`}
                contentContainerStyle={styles.listContent}
                
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => handleTaskPress(item)}>
                    <View style={styles.taskContainer}>
                      <View style={styles.taskLeft}>
                        <Checkbox
                          value={item.isDone}
                          onValueChange={() => toggleTaskDone(index)}
                        />
                        <Text
                          style={[
                            styles.taskText,
                            item.isDone && styles.taskDoneText,
                          ]}
                        >
                          {item.title}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteTask(index)}>
                        <Ionicons name="trash" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* Add Task */}
              <View style={styles.addContainer}>
                <TouchableOpacity onPress={handleAddTask}>
                  <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
                <TextInput
                  placeholder="Add Task"
                  value={newTask}
                  onChangeText={setNewTask}
                  style={styles.addText}
                  placeholderTextColor="#888"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  searchContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    paddingBottom: 120,
  },
  taskContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  taskDoneText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(128, 25, 71, 0.08)",
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingBottom: 60,
  },
  addText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "white",
  },
  emptyText: {
    textAlign: "center",
    color: "#ccc",
    marginTop: 20,
    fontSize: 16,
  },
});

export default MyDay;
