import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // or your preferred icon library

const { width, height } = Dimensions.get("window");

const SearchModalApp = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Sample data - replace with your actual data
  const [tasksData] = useState([
    {
      id: 1,
      name: "Complete project proposal",
      description: "Write and submit the Q2 project proposal",
      type: "Task",
    },
    {
      id: 2,
      name: "Team meeting",
      description: "Weekly standup with development team",
      type: "Meeting",
    },
    {
      id: 3,
      name: "Code review",
      description: "Review pull requests from team members",
      type: "Task",
    },
    {
      id: 4,
      name: "Update documentation",
      description: "Update API documentation with new endpoints",
      type: "Documentation",
    },
    {
      id: 5,
      name: "Bug fixes",
      description: "Fix critical bugs in production",
      type: "Task",
    },
    {
      id: 6,
      name: "Client presentation",
      description: "Present new features to client",
      type: "Meeting",
    },
  ]);

  const searchFields = ["name", "description", "type"];

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData([]);
    } else {
      const filtered = tasksData.filter((item) => {
        return searchFields.some((field) =>
          item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredData(filtered);
    }
  }, [searchQuery, tasksData]);

  const handleSearchIconPress = () => {
    setSearchModalVisible(true);
  };

  const handleCloseSearch = () => {
    setSearchQuery("");
    setFilteredData([]);
    setSearchModalVisible(false);
  };

  const handleSelectSearchResult = (item) => {
    console.log("Selected item:", item);
    // Handle the selected item (navigate, update state, etc.)
    handleCloseSearch();
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectSearchResult(item)}
    >
      <Text style={styles.resultTitle}>{item.name}</Text>
      {item.description && (
        <Text style={styles.resultDescription}>{item.description}</Text>
      )}
      {item.type && <Text style={styles.resultType}>{item.type}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.parentContainer}>
      {/* Parent Screen */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.parentHeader}>
        {/* Search Icon Button */}
        <TouchableOpacity onPress={handleSearchIconPress}>
          <Icon name="search" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Sample content */}
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>
          Your tasks and content will be displayed here.
        </Text>
        <Text style={styles.instructionText}>
          Tap the search icon above to open the search modal and filter through
          your tasks.
        </Text>
      </View>

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        presentationStyle='pageSheet'
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#8B9DC3" />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <Icon
                name="search"
                size={20}
                color="#FFFFFF"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="What would you like to find? You can search within tasks, steps, and notes"
                placeholderTextColor="#FFFFFF80"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
            <TouchableOpacity
              onPress={handleCloseSearch}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Search Icon with floating bubbles */}
          {searchQuery.length === 0 && (
            <>
              <View style={styles.searchIconContainer}>
                <Image
                  source={require("../../assets/images/searchIcon.png")}
                  style={styles.illustration}
                />
              </View>

              {/* Prompt text */}
              <Text style={styles.promptText}>
                What would you like to find? You can{"\n"}search within tasks,
                steps, and notes
              </Text>
            </>
          )}

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <View style={styles.resultsContainer}>
              {filteredData.length > 0 ? (
                <FlatList
                  data={filteredData}
                  renderItem={renderSearchResult}
                  keyExtractor={(item, index) =>
                    item.id?.toString() || index.toString()
                  }
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No results found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try adjusting your search terms
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Parent Screen Styles
  parentContainer: {
    
    backgroundColor: "#FFFFFF",
  },
  parentHeader: {
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 5,
    paddingRight:20
  },
  contentContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  contentText: {
    fontSize: 18,
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },

  // Search Icon Button Styles
  illustration: {
    width: width * 0.75,
    height: width * 0.75,
    maxHeight: 250,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#8B9DC3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
  },
  cancelButton: {
    paddingHorizontal: 8,
  },
  cancelText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  searchIconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  searchIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7B8FB5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  bubble1: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    top: "30%",
    left: "25%",
    zIndex: 1,
  },
  bubble2: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    top: "20%",
    right: "30%",
    zIndex: 1,
  },
  bubble3: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    bottom: "35%",
    left: "20%",
    zIndex: 1,
  },
  promptText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 40,
    marginBottom: 40,
    lineHeight: 24,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  resultItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  resultType: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  noResultsContainer: {
    padding: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
});

export default SearchModalApp;
