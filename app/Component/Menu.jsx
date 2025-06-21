import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavigation } from "expo-router";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const Menu = ({
  customGroups = [],
  userLists = [],
  onGroupPress,
  onListPress,
  onDeleteList, // New prop for delete callback
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  const navigation = useNavigation();

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const menuItems = [
    {
      icon: "sunny-outline",
      title: "My Day",
      color: "#007AFF",
      router: "/MyDay",
    },
    {
      icon: "star-outline",
      title: "Important",
      color: "#FF9500",
      router: "/Important",
    },
    {
      icon: "calendar-outline",
      title: "Planned",
      color: "#34C759",
      router: "/Planned",
    },
    {
      icon: "infinite-outline",
      title: "All",
      color: "#FF3B30",
      badge: "1",
      router: "/All",
    },
    {
      icon: "checkmark-circle-outline",
      title: "Completed",
      color: "#8E8E93",
      router: "/Completed",
    },
    {
      icon: "person-outline",
      title: "Assigned to me",
      color: "#34C759",
      router: "/Assigned",
    },
    {
      icon: "flag-outline",
      title: "Flagged email",
      color: "#FF9500",
      router: "/flag",
    },
    {
      icon: "home-outline",
      title: "Tasks",
      color: "#5856D6",
      badge: "1",
      router: "/Task",
    },
  ];

  const getTaskCount = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return 0;
    return tasks.filter((task) => !task.completed).length;
  };

  const getCompletedCount = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return 0;
    return tasks.filter((task) => task.completed).length;
  };

  // Right action for swipe to delete
  const renderRightAction = (listId, listTitle, onDelete) => {
    return (
      <Animated.View style={styles.deleteAction}>
        <Pressable
          style={styles.deleteButton}
          onPress={() => {
            if (onDelete) {
              onDelete(listId, listTitle);
            }
          }}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  // Swipeable List Item Component
  const SwipeableListItem = ({ list, index, onDelete }) => {
    const pendingTasks = getTaskCount(list.tasks);
    const completedTasks = getCompletedCount(list.tasks);

    return (
      <Swipeable
        key={`list-${index}`}
        renderRightActions={() =>
          renderRightAction(list.id || index, list.title, onDelete)
        }
        rightThreshold={40}
      >
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("NewList")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="list-outline"
              size={20}
              color="#5856D6"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>{list.title}</Text>
            {completedTasks > 0 && (
              <Text style={styles.countText}>{completedTasks} completed</Text>
            )}
          </View>
          {pendingTasks > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingTasks}</Text>
            </View>
          )}
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {menuItems.map((item, index) => (
          <Link href={item.router} asChild key={index}>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.color}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </Pressable>
          </Link>
        ))}

        {/* Separator before user lists */}
        {userLists.length > 0 && <View style={styles.separator} />}

        {/* Render User Created Lists with Swipe to Delete */}
        {userLists.map((list, index) => (
          <SwipeableListItem
            key={`swipeable-list-${index}`}
            list={list}
            index={index}
            onDelete={onDeleteList}
          />
        ))}

        {/* Render Custom Groups */}
        {customGroups.map((group, index) => (
          <View key={`group-${index}`}>
            {/* Group Header */}
            <Pressable
              style={styles.groupHeader}
              onPress={() => toggleGroup(group.id)}
            >
              <View style={styles.groupHeaderLeft}>
                <View style={styles.groupIcon}>
                  <Ionicons name="today-outline" size={25} color="black" />
                </View>
                <Text style={styles.groupTitle}>{group.name}</Text>
              </View>
              <View style={styles.groupHeaderRight}>
                <Pressable style={styles.moreButton}>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={16}
                    color="#8E8E93"
                  />
                </Pressable>
                <Ionicons
                  name={
                    expandedGroups[group.id]
                      ? "chevron-down"
                      : "chevron-forward"
                  }
                  size={16}
                  color="#8E8E93"
                />
              </View>
            </Pressable>

            {/* Group Content - Expanded State */}
            {expandedGroups[group.id] && (
              <View style={styles.groupContent}>
                <View style={styles.addListArea}>
                  <Text style={styles.addListText}>
                    Tap or Drag Here to Add Lists
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "white", // Ensure white background for swipe
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
    width: 20,
  },
  menuText: {
    fontSize: 17,
    color: "#000",
    fontWeight: "400",
    marginRight: 8,
  },
  countText: {
    color: "#8E8E93",
    fontWeight: "400",
    fontSize: 14,
    marginLeft: 4,
  },
  badge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  separator: {
    height: 20,
    backgroundColor: "#F2F2F7",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomColor: "#38383A",
  },
  groupHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  groupIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  groupTitle: {
    fontSize: 17,
    color: "black",
    fontWeight: "500",
  },
  groupHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreButton: {
    padding: 8,
    marginRight: 8,
  },
  groupContent: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addListArea: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  addListText: {
    color: "#8E8E93",
    fontSize: 17,
    fontWeight: "400",
  },
  // Swipe to delete styles
  deleteAction: {
    flex: 0.15,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default Menu;
