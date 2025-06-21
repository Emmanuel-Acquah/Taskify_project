import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../context.jsx/Themecontext";
import SwipeableTaskItem from "../Component/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const NewList = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    currentTheme,
    getTextColor,
    getSecondaryTextColor,
    getBackgroundStyle,
    getOverlayStyle,
  } = useTheme();

  // State management
  const [listTitle, setListTitle] = useState(
    params.listTitle || "Untitled list"
  );
  const [tasks, setTasks] = useState(
    params.listTasks ? JSON.parse(params.listTasks) : []
  );
  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  // Refs
  const titleInputRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Memoized theme styles
  const themeStyles = useMemo(
    () => ({
      textColor: getTextColor(),
      secondaryTextColor: getSecondaryTextColor(),
      backgroundStyle: getBackgroundStyle(),
      overlayStyle: getOverlayStyle(),
    }),
    [getTextColor, getSecondaryTextColor, getBackgroundStyle, getOverlayStyle]
  );

  // Enhanced theme styles for different components
  const enhancedThemeStyles = useMemo(() => {
    const isPhotoTheme = currentTheme?.type === "photo";
    const isDarkColor =
      currentTheme?.type === "color" &&
      ["#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#6B7280"].includes(
        currentTheme.color
      );

    return {
      iconColor: isPhotoTheme
        ? "#FFFFFF"
        : isDarkColor
        ? "#FFFFFF"
        : themeStyles.textColor,
      borderColor: isPhotoTheme
        ? "rgba(255, 255, 255, 0.3)"
        : isDarkColor
        ? "rgba(255, 255, 255, 0.3)"
        : "#E5E7EB",
      inputBackground: isPhotoTheme
        ? "rgba(255, 255, 255, 0.1)"
        : isDarkColor
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      transparentBackground: isPhotoTheme
        ? "rgba(0, 0, 0, 0.3)"
        : isDarkColor
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(255, 255, 255, 0.9)",
      taskBackground: "#FFFFFF",
      taskTextColor: "#000000",
      taskSecondaryTextColor: "#6B7280",
    };
  }, [currentTheme, themeStyles]);

  // Animated values for scroll effects
  const animatedValues = useMemo(() => {
    const titleAnimationStart = 50;
    const titleAnimationEnd = 100;

    return {
      headerTitleOpacity: scrollY.interpolate({
        inputRange: [titleAnimationStart, titleAnimationEnd],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      bodyTitleOpacity: scrollY.interpolate({
        inputRange: [titleAnimationStart, titleAnimationEnd],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
      titleScale: scrollY.interpolate({
        inputRange: [0, titleAnimationEnd],
        outputRange: [1, 0.8],
        extrapolate: "clamp",
      }),
      titleTranslateY: scrollY.interpolate({
        inputRange: [0, titleAnimationEnd],
        outputRange: [0, -40],
        extrapolate: "clamp",
      }),
    };
  }, [scrollY]);

  // Content wrapper component
  const ContentWrapper = useMemo(() => {
    return ({ children }) => {
      if (currentTheme?.type === "photo" && currentTheme.uri) {
        return (
          <ImageBackground
            source={{ uri: currentTheme.uri }}
            style={[styles.container, themeStyles.backgroundStyle]}
            resizeMode="cover"
          >
            <View style={themeStyles.overlayStyle}>{children}</View>
          </ImageBackground>
        );
      }
      return (
        <View style={[styles.container, themeStyles.backgroundStyle]}>
          {children}
        </View>
      );
    };
  }, [currentTheme, themeStyles.backgroundStyle, themeStyles.overlayStyle]);

  // Focus title input when component mounts or when coming from rename
  useFocusEffect(
    useCallback(() => {
      if (params.focusTitle === "true") {
        const timer = setTimeout(() => {
          if (titleInputRef.current) {
            titleInputRef.current.focus();
            setIsTitleFocused(true);
          }
        }, 200);
        return () => clearTimeout(timer);
      }
    }, [params.focusTitle])
  );

  // Organize tasks into completed and uncompleted
  const organizedTasks = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed);
    const uncompletedTasks = tasks.filter((t) => !t.completed);

    return {
      completed: completedTasks,
      uncompleted: uncompletedTasks,
      totalTasks: tasks.length,
      completedCount: completedTasks.length,
      pendingCount: uncompletedTasks.length,
    };
  }, [tasks]);

  // Status bar style
  const statusBarStyle = useMemo(() => {
    return currentTheme?.type === "photo" ||
      (currentTheme?.type === "color" &&
        ["#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#6B7280"].includes(
          currentTheme.color
        ))
      ? "light-content"
      : "dark-content";
  }, [currentTheme]);

  // Event handlers
  const handleScroll = useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
    }),
    [scrollY]
  );

  const handleTitleChange = useCallback((text) => {
    setListTitle(text);
  }, []);

  const handleTitleFocus = useCallback(() => {
    setIsTitleFocused(true);
  }, []);

  const handleTitleBlur = useCallback(() => {
    setIsTitleFocused(false);
    // Clear the focusTitle param after use
    if (params.focusTitle === "true") {
      router.setParams({ focusTitle: undefined });
    }
  }, [params.focusTitle, router]);

  const toggleTaskCompletion = useCallback((taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );
  }, []);

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      const task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prevTasks) => [task, ...prevTasks]);
      setNewTask("");
      setIsAddingTask(false);
      Keyboard.dismiss();
    }
  }, [newTask]);

  const deleteTask = useCallback((taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
          );
        },
      },
    ]);
  }, []);

  const toggleCompletedSection = useCallback(() => {
    setShowCompleted(!showCompleted);
  }, [showCompleted]);

  const handleAddTaskPress = useCallback(() => {
    setIsAddingTask(true);
  }, []);

  const handleTaskInputBlur = useCallback(() => {
    if (!newTask.trim()) {
      setIsAddingTask(false);
    }
  }, [newTask]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ContentWrapper>
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.container}
            >
              <StatusBar barStyle={statusBarStyle} />

              {/* Header */}
              <View
                style={[
                  styles.header,
                  {
                    borderBottomColor: enhancedThemeStyles.borderColor,
                    backgroundColor:
                      currentTheme?.type === "photo"
                        ? enhancedThemeStyles.transparentBackground
                        : "transparent",
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={enhancedThemeStyles.iconColor}
                  />
                  <Text
                    style={[
                      styles.backText,
                      { color: enhancedThemeStyles.iconColor },
                    ]}
                  >
                    Lists
                  </Text>
                </TouchableOpacity>

                {/* Header Title (appears when scrolling) */}
                <Animated.View
                  style={[
                    styles.headerTitleContainer,
                    { opacity: animatedValues.headerTitleOpacity },
                  ]}
                >
                  <Text
                    style={[
                      styles.headerTitle,
                      { color: themeStyles.textColor },
                      currentTheme?.type === "photo" &&
                        styles.titleWithPhotoShadow,
                    ]}
                    numberOfLines={1}
                  >
                    {listTitle || "Untitled list"}
                  </Text>
                </Animated.View>

                <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.menuButton}>
                    <Ionicons
                      name="person-add-outline"
                      size={24}
                      color={enhancedThemeStyles.iconColor}
                    />
                  </TouchableOpacity>

                  <Link href="/ListOption" asChild>
                    <TouchableOpacity style={styles.menuButton}>
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={24}
                        color={enhancedThemeStyles.iconColor}
                      />
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>

              {/* Scrollable Body */}
              <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
              >
                {/* Body Title (disappears when scrolling) */}
                <Animated.View
                  style={[
                    styles.bodyTitleContainer,
                    {
                      opacity: animatedValues.bodyTitleOpacity,
                      transform: [
                        { translateY: animatedValues.titleTranslateY },
                        { scale: animatedValues.titleScale },
                      ],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.titleInputContainer,
                      {
                        backgroundColor: isTitleFocused
                          ? enhancedThemeStyles.inputBackground
                          : "transparent",
                        borderColor: isTitleFocused
                          ? enhancedThemeStyles.borderColor
                          : "transparent",
                        borderWidth: isTitleFocused ? 1 : 0,
                      },
                    ]}
                  >
                    <TextInput
                      ref={titleInputRef}
                      style={[
                        styles.bodyTitle,
                        { color: themeStyles.textColor },
                        currentTheme?.type === "photo" &&
                          styles.titleWithPhotoShadow,
                      ]}
                      value={listTitle}
                      onChangeText={handleTitleChange}
                      placeholder="Untitled list"
                      placeholderTextColor={themeStyles.secondaryTextColor}
                      multiline={false}
                      blurOnSubmit={true}
                      onFocus={handleTitleFocus}
                      onBlur={handleTitleBlur}
                    />
                  </View>

                  <Text
                    style={[
                      styles.taskCount,
                      { color: themeStyles.secondaryTextColor },
                    ]}
                  >
                    {organizedTasks.totalTasks} tasks •{" "}
                    {organizedTasks.completedCount} completed •{" "}
                    {organizedTasks.pendingCount} pending
                  </Text>
                </Animated.View>

                {/* Uncompleted Tasks */}
                {organizedTasks.uncompleted.length > 0 && (
                  <View style={styles.taskSection}>
                    {organizedTasks.uncompleted.map((task, index) => (
                      <View
                        key={`uncompleted-${task.id}`}
                        style={[
                          styles.taskItemWrapper,
                          {
                            zIndex: organizedTasks.uncompleted.length - index,
                            elevation:
                              organizedTasks.uncompleted.length - index,
                          },
                        ]}
                      >
                        <View style={styles.taskCard}>
                          <SwipeableTaskItem
                            item={task}
                            themeStyles={{
                              ...themeStyles,
                              textColor: enhancedThemeStyles.taskTextColor,
                              secondaryTextColor:
                                enhancedThemeStyles.taskSecondaryTextColor,
                            }}
                            enhancedThemeStyles={enhancedThemeStyles}
                            toggleTaskCompletion={toggleTaskCompletion}
                            deleteTask={deleteTask}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Completed Tasks Section */}
                {organizedTasks.completed.length > 0 && (
                  <View style={styles.completedSection}>
                    <TouchableOpacity
                      style={styles.completedHeader}
                      onPress={toggleCompletedSection}
                    >
                      <Ionicons
                        name={
                          showCompleted ? "chevron-down" : "chevron-forward"
                        }
                        size={20}
                        color={themeStyles.textColor}
                      />
                      <Text
                        style={[
                          styles.completedHeaderText,
                          { color: themeStyles.textColor },
                        ]}
                      >
                        Completed ({organizedTasks.completedCount})
                      </Text>
                    </TouchableOpacity>

                    {showCompleted && (
                      <View style={styles.completedTasksContainer}>
                        {organizedTasks.completed.map((task, index) => (
                          <View
                            key={`completed-${task.id}`}
                            style={[
                              styles.taskItemWrapper,
                              {
                                zIndex: organizedTasks.completed.length - index,
                                elevation:
                                  organizedTasks.completed.length - index,
                              },
                            ]}
                          >
                            <View style={styles.taskCard}>
                              <SwipeableTaskItem
                                item={task}
                                themeStyles={{
                                  ...themeStyles,
                                  textColor: enhancedThemeStyles.taskTextColor,
                                  secondaryTextColor:
                                    enhancedThemeStyles.taskSecondaryTextColor,
                                }}
                                enhancedThemeStyles={enhancedThemeStyles}
                                toggleTaskCompletion={toggleTaskCompletion}
                                deleteTask={deleteTask}
                              />
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Empty State */}
                {organizedTasks.totalTasks === 0 && (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="list-outline"
                      size={48}
                      color={themeStyles.secondaryTextColor}
                    />
                    <Text
                      style={[
                        styles.emptyStateText,
                        { color: themeStyles.textColor },
                      ]}
                    >
                      No tasks yet
                    </Text>
                    <Text
                      style={[
                        styles.emptyStateSubtext,
                        { color: themeStyles.secondaryTextColor },
                      ]}
                    >
                      Tap "Add a Task" to get started
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Footer - Add Task */}
              <View
                style={[
                  styles.footer,
                  {
                    borderTopColor: enhancedThemeStyles.borderColor,
                    backgroundColor:
                      currentTheme?.type === "photo"
                        ? enhancedThemeStyles.transparentBackground
                        : "transparent",
                  },
                ]}
              >
                {isAddingTask ? (
                  <View
                    style={[
                      styles.keyboardModal,
                      {
                        backgroundColor: enhancedThemeStyles.taskBackground,
                        borderColor: enhancedThemeStyles.borderColor,
                      },
                    ]}
                  >
                    <View style={styles.inputRow}>
                      <View
                        style={[
                          styles.emptyCheckButton,
                          { borderColor: enhancedThemeStyles.borderColor },
                        ]}
                      />

                      <TextInput
                        style={[
                          styles.taskInput,
                          {
                            color: enhancedThemeStyles.taskTextColor,
                            borderBottomColor: enhancedThemeStyles.borderColor,
                          },
                        ]}
                        value={newTask}
                        onChangeText={setNewTask}
                        placeholder="Add a Task"
                        placeholderTextColor={
                          enhancedThemeStyles.taskSecondaryTextColor
                        }
                        autoFocus
                        onSubmitEditing={addTask}
                        returnKeyType="done"
                        onBlur={handleTaskInputBlur}
                      />
                    </View>

                    <View style={styles.suggestionButtons}>
                      {["sunny", "notifications", "today", "reader"].map(
                        (icon) => (
                          <TouchableOpacity key={icon}>
                            <Ionicons
                              name={`${icon}-outline`}
                              size={20}
                              color={enhancedThemeStyles.taskTextColor}
                            />
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      {
                        backgroundColor: enhancedThemeStyles.taskBackground,
                        borderColor: enhancedThemeStyles.borderColor,
                      },
                    ]}
                    onPress={handleAddTaskPress}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={enhancedThemeStyles.taskTextColor}
                    />
                    <Text
                      style={[
                        styles.addButtonText,
                        { color: enhancedThemeStyles.taskTextColor },
                      ]}
                    >
                      Add a Task
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </ContentWrapper>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 18,
    marginLeft: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    maxWidth: "80%",
  },
  headerActions: {
    flexDirection: "row",
  },
  menuButton: {
    marginLeft: 16,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  bodyTitleContainer: {
    padding: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  titleInputContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    width: "100%",
  },
  bodyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  taskCount: {
    fontSize: 14,
    textAlign: "center",
  },
  taskSection: {
    paddingHorizontal: 16,
  },
  taskItemWrapper: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  completedSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  completedHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  completedHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  completedTasksContainer: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  keyboardModal: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  suggestionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  emptyCheckButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },
  titleWithPhotoShadow: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default NewList;
