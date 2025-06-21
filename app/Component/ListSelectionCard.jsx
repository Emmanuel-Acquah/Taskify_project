import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Individual list card component for selection
const ListSelectionCard = ({ list, isSelected, onToggle }) => {
  const taskCount = list.tasks ? list.tasks.length : 0;
  const completedCount = list.tasks
    ? list.tasks.filter((task) => task.completed).length
    : 0;

  return (
    <TouchableOpacity
      style={[styles.listCard, isSelected && styles.selectedListCard]}
      onPress={() => onToggle(list.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.listInfo}>
            <Text style={styles.listTitle} numberOfLines={1}>
              {list.title || "Untitled List"}
            </Text>
            <Text style={styles.taskCount}>
              {completedCount}/{taskCount} tasks
            </Text>
          </View>

          <View
            style={[
              styles.selectionButton,
              isSelected && styles.selectedButton,
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </View>

        {taskCount > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    taskCount > 0 ? (completedCount / taskCount) * 100 : 0
                  }%`,
                },
              ]}
            />
          </View>
        )}

        <Text style={styles.createdDate}>
          Created {new Date(list.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Main component for showing available lists when creating a group
const GroupListSelectionCard = ({
  visible,
  groupName,
  availableLists,
  onClose,
  onAddListsToGroup,
}) => {
  const [selectedLists, setSelectedLists] = useState([]);

  const handleToggleList = (listId) => {
    setSelectedLists((prev) => {
      if (prev.includes(listId)) {
        return prev.filter((id) => id !== listId);
      } else {
        return [...prev, listId];
      }
    });
  };

  const handleAddToGroup = () => {
    if (selectedLists.length === 0) {
      Alert.alert(
        "No Lists Selected",
        "Please select at least one list to add to the group."
      );
      return;
    }

    onAddListsToGroup(selectedLists);
    setSelectedLists([]);
  };

  const handleClose = () => {
    setSelectedLists([]);
    onClose();
  };

  const handleSelectAll = () => {
    if (selectedLists.length === availableLists.length) {
      setSelectedLists([]);
    } else {
      setSelectedLists(availableLists.map((list) => list.id));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Add Lists</Text>
            <Text style={styles.headerSubtitle}>to "{groupName}"</Text>
          </View>

          <TouchableOpacity
            onPress={handleAddToGroup}
            style={[
              styles.addButton,
              selectedLists.length === 0 && styles.addButtonDisabled,
            ]}
            disabled={selectedLists.length === 0}
          >
            <Text
              style={[
                styles.addButtonText,
                selectedLists.length === 0 && styles.addButtonTextDisabled,
              ]}
            >
              Add ({selectedLists.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Select All Button */}
          {availableLists.length > 0 && (
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={handleSelectAll}
            >
              <View style={styles.selectAllContent}>
                <Text style={styles.selectAllText}>
                  {selectedLists.length === availableLists.length
                    ? "Deselect All"
                    : "Select All"}
                </Text>
                <Text style={styles.selectAllCount}>
                  {selectedLists.length}/{availableLists.length} selected
                </Text>
              </View>
              <Ionicons
                name={
                  selectedLists.length === availableLists.length
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>
          )}

          {/* Lists */}
          {availableLists.length > 0 ? (
            <FlatList
              data={availableLists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ListSelectionCard
                  list={item}
                  isSelected={selectedLists.includes(item.id)}
                  onToggle={handleToggleList}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="folder-outline" size={64} color="#C7C7CC" />
              <Text style={styles.emptyStateTitle}>No Lists Available</Text>
              <Text style={styles.emptyStateText}>
                Create some lists first, then you can add them to groups.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  addButtonTextDisabled: {
    color: "#C7C7CC",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectAllContent: {
    flex: 1,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  selectAllCount: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedListCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  listInfo: {
    flex: 1,
    marginRight: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    color: "#8E8E93",
  },
  selectionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  createdDate: {
    fontSize: 12,
    color: "#C7C7CC",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default GroupListSelectionCard;
