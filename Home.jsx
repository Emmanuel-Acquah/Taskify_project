import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FirstBottomSheet from "./FirstBottomSheet";
import { useNavigation, useFocusEffect, router } from "expo-router";
import Menu from "../Component/Menu";
import NoteButton from "../Component/NoteButton";
import SearchModalApp from "../Component/searchScreen";
import OnboardingBottomSheet from "./OnboardBottomSheet";
import GroupList from "../Component/GroupList";

const Home = () => {
  const name = "Prince Acquah";
  const email = "acquah@gmail.com";

  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["100%"], []);
  const [isOpen, setIsOpen] = useState(false);

  // Custom groups state
  const [customGroups, setCustomGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Lists state - NEW
  const [userLists, setUserLists] = useState([]);

  // Onboarding states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Check onboarding status on component mount
  useEffect(() => {
    checkOnboardingStatus();
    loadCustomGroups();
    loadUserLists(); // Load user lists on mount
  }, []);

  // Load user lists when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserLists();
    }, [])
  );

  const checkOnboardingStatus = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        "onboardingCompleted"
      );

      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      } else {
        setOnboardingCompleted(true);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  const loadCustomGroups = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem("customGroups");
      if (savedGroups) {
        setCustomGroups(JSON.parse(savedGroups));
      }
    } catch (error) {
      console.error("Error loading custom groups:", error);
    }
  };

  const loadUserLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem("userLists");
      if (savedLists) {
        setUserLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error("Error loading user lists:", error);
    }
  };
  const handleClearUserLists = async () => {
    try {
      await AsyncStorage.removeItem("userLists");
      setUserLists([]);
      console.log("User lists cleared successfully");
    } catch (error) {
      console.error("Error clearing user lists:", error);
    }
  };

  const saveCustomGroups = async (groups) => {
    try {
      await AsyncStorage.setItem("customGroups", JSON.stringify(groups));
    } catch (error) {
      console.error("Error saving custom groups:", error);
    }
  };

  const handleCreateGroup = (groupName) => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      itemCount: 1, // Default with "Untitled list"
      created: new Date().toISOString(),
      lists: [],
    };

    const updatedGroups = [...customGroups, newGroup];
    setCustomGroups(updatedGroups);
    saveCustomGroups(updatedGroups);
  };

  const handleGroupPress = (group) => {
    setSelectedGroup(group);
  };

  const handleBackFromGroup = () => {
    setSelectedGroup(null);
  };
  const handleClearGroup = async () => {
    try {
      await AsyncStorage.removeItem("customGroups");
      setCustomGroups([]);
      console.log("User lists cleared successfully");
    } catch (error) {
      console.error("Error clearing user lists:", error);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Save onboarding completion status
      await AsyncStorage.setItem("onboardingCompleted", "true");
      setShowOnboarding(false);
      setOnboardingCompleted(true);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const handleSheetChange = useCallback((index) => {
    setIsOpen(index !== -1);
  }, []);

  const toggleSheet = useCallback(() => {
    if (isOpen) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.expand();
    }
  }, [isOpen]);

  // Handle list press - NEW
  const handleListPress = (list) => {
    // Navigate to the list detail screen or handle list selection
    navigation.navigate("NewList", {
      listId: list.id,
      listTitle: list.title,
      listTasks: list.tasks,
    });
  };
  const handleDeleteList = async (listId, listTitle) => {
    Alert.alert(
      "Delete List",
      `Are you sure you want to delete "${listTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Remove from state
              const updatedLists = userLists.filter(
                (list, index) =>
                  (list.id !== undefined ? list.id : index) !== listId
              );

              // Update state
              setUserLists(updatedLists);

              // SAVE TO ASYNCSTORAGE - This is what you're missing!
              await AsyncStorage.setItem(
                "YOUR_STORAGE_KEY",
                JSON.stringify(updatedLists)
              );
            } catch (error) {
              console.error("Delete failed:", error);
              Alert.alert("Error", "Failed to delete list");
            }
          },
        },
      ]
    );
  };

  // If a group is selected, show the GroupList component
  if (selectedGroup) {
    return (
      <SafeAreaView style={styles.container}>
        <GroupList
          groupName={selectedGroup.name}
          onBack={handleBackFromGroup}
        />
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={toggleSheet} style={styles.headerButton}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>PA</Text>
            </View>
            <Text style={styles.headerText}>{name}</Text>
          </Pressable>
          <SearchModalApp style={styles.search} />
        </View>

        <Menu
          customGroups={customGroups}
          userLists={userLists}
          onGroupPress={handleGroupPress}
          onListPress={handleListPress}
          onDeleteList={handleDeleteList}
        />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Pressable
            onPress={() => router.push("/(firstScreen)/NewList")}
            style={styles.newListButton}
          >
            <Ionicons name="add" size={24} color="#007AFF" />
            <Text style={styles.newListText}>New List</Text>
          </Pressable>
          <NoteButton onCreateGroup={handleCreateGroup} />
        </View>

        {/* Profile Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChange}
        >
          <BottomSheetView style={styles.contentContainer}>
            <FirstBottomSheet
              name={name}
              email={email}
              onClearUserLists={handleClearUserLists}
              onClearGroup={handleClearGroup}
            />
          </BottomSheetView>
        </BottomSheet>

        {/* Onboarding Bottom Sheet */}
        <OnboardingBottomSheet
          isVisible={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  search: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8E8E93",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
  },
  newListButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  newListText: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
  },
});

export default Home;
