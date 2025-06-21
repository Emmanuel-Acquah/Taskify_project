// contexts/ListsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListsContext = createContext();

export const ListsProvider = ({ children }) => {
  const [userLists, setUserLists] = useState([]);

  // Load lists from storage on initial render
  useEffect(() => {
    const loadLists = async () => {
      try {
        const savedLists = await AsyncStorage.getItem("userLists");
        if (savedLists) {
          setUserLists(JSON.parse(savedLists));
        }
      } catch (error) {
        console.error("Error loading lists:", error);
      }
    };
    loadLists();
  }, []);

  // Save lists to storage whenever they change
  useEffect(() => {
    const saveLists = async () => {
      try {
        await AsyncStorage.setItem("userLists", JSON.stringify(userLists));
      } catch (error) {
        console.error("Error saving lists:", error);
      }
    };
    saveLists();
  }, [userLists]);

  const addOrUpdateList = (list) => {
    setUserLists((prevLists) => {
      // Check if list already exists
      const existingIndex = prevLists.findIndex((l) => l.id === list.id);

      if (existingIndex >= 0) {
        // Update existing list
        const updatedLists = [...prevLists];
        updatedLists[existingIndex] = list;
        return updatedLists;
      } else {
        // Add new list
        return [...prevLists, list];
      }
    });
  };

  const deleteList = (listId) => {
    setUserLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  };

  return (
    <ListsContext.Provider value={{ userLists, addOrUpdateList, deleteList }}>
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => useContext(ListsContext);
