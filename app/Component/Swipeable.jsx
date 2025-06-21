// components/SwipeableTaskItem.js

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = -80;

const SwipeableTaskItem = ({
  item,
  themeStyles,
  enhancedThemeStyles,
  toggleTaskCompletion,
  deleteTask,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSwiped, setIsSwiped] = useState(false);
  const isWhiteBg = enhancedThemeStyles.inputBackground === "#FFFFFF";

  const checkBgColor = isWhiteBg ? "#8B5CF6" : "blue";

  // Fixed gesture event handler
  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        // Optional: Add any additional logic here
        const { translationX } = event.nativeEvent;
        // Clamp the translation to prevent over-swiping
        if (translationX > 0) {
          translateX.setValue(0);
        } else if (translationX < -100) {
          translateX.setValue(-100);
        }
      },
    }
  );

  const handleStateChange = (event) => {
    const { state, translationX } = event.nativeEvent;

    if (state === State.END || state === State.CANCELLED) {
      if (translationX < SWIPE_THRESHOLD) {
        // Show delete action
        Animated.timing(translateX, {
          toValue: -80,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => setIsSwiped(true));
      } else {
        // Hide delete action
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start(() => setIsSwiped(false));
      }
    }
  };

  const resetSwipe = () => {
    if (isSwiped) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsSwiped(false));
    }
  };

  const handleTaskToggle = () => {
    resetSwipe();
    // Add small delay to ensure swipe animation completes
    setTimeout(
      () => {
        toggleTaskCompletion(item.id);
      },
      isSwiped ? 250 : 0
    );
  };

  const handleDelete = () => {
    resetSwipe();
    setTimeout(() => {
      deleteTask(item.id);
    }, 250);
  };

  return (
    <View style={styles.swipeWrapper}>
      {/* Delete Background */}
      <View style={[styles.deleteBackground, { borderRadius: 21 }]}>
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Task Content */}
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
        activeOffsetX={[-15, 15]}
        failOffsetY={[-10, 10]}
        shouldCancelWhenOutside={true}
        enabled={true}
      >
        <Animated.View
          style={[
            styles.taskContainer,
            {
              backgroundColor: "white",
              borderBottomColor: enhancedThemeStyles.borderColor,
              transform: [{ translateX }],
            },
          ]}
        >
          {/* Checkbox */}
          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: item.completed ? checkBgColor : "white",
                borderColor: item.completed
                  ? checkBgColor
                  :  "black",
              },
            ]}
            onPress={handleTaskToggle}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {item.completed && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </TouchableOpacity>

          {/* Task Text */}
          <TouchableOpacity
            style={styles.taskTextContainer}
            onPress={handleTaskToggle}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.taskText,
                {
                  color: item.completed
                    ? themeStyles.secondaryTextColor
                    : themeStyles.textColor,
                },
                item.completed && {
                  ...styles.taskTextCompleted,
                  opacity: 0.6,
                },
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>

          {/* Star Button */}
          <TouchableOpacity
            style={styles.starButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="star-outline"
              size={16}
              color={themeStyles.secondaryTextColor}
            />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  swipeWrapper: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 0,
    padding: 4,
    marginBottom: 2, // Add small margin to prevent overlap
    position: "relative",
  },
  deleteBackground: {
    position: "absolute",
    backgroundColor: "#FF3B30",
    right: 4,
    top: 4,
    bottom: 4,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  deleteAction: {
    width: "100%",
    height: "100%",
    paddingLeft: 250,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 15,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    
    zIndex: 2,
    minHeight: 48,
    borderRadius: 14,
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  taskText: {
    fontSize: 16,
    lineHeight: 20,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
  },
  starButton: {
    padding: 8,
  },
});

export default React.memo(SwipeableTaskItem);
