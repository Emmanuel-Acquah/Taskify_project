import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";


const { width, height } = Dimensions.get("window");

const OnboardingBottomSheet = ({ isVisible, onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["79%"], []);

  // Onboarding screens data
  const screens = [
    {
      id: 1,
      title: "One place for all your tasks",
      description:
        "Plan your day effectively by capturing and organising all your tasks – be it personal or work-related – in one place",
      //imageUri: "../../assets/images/colab1.png", // Replace with your image URI
      // Alternative: use require for local images
      imageSource: require("../../assets/images/colab1.png"),
    },
    {
      id: 2,
      title: "Access anywhere",
      description:
        "Access your tasks and lists anywhere on-the-go on all your devices",
      //imageUri: '../../assets/images/colab2.png', // Replace with your image URI
      imageSource: require("../../assets/images/colab2.png"),
    },
    {
      id: 3,
      title: "Collaborate quickly",
      description:
        "Get more done by sharing lists and delegating tasks on the app",
      // imageUri: '../../assets/images/colab3.png', // Replace with your image URI
      imageSource: require("../../assets/images/colab3.png"),
    },
  ];

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    bottomSheetRef.current?.close();
    onComplete();
  };

  const renderIllustration = (screenData) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={screenData.imageSource}
          // For local images, use: source={screenData.imageSource}
          style={styles.onboardingImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  const currentScreenData = screens[currentScreen];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.onboardingContainer}>
          {/* Illustration */}
          <View style={styles.illustrationWrapper}>
            {renderIllustration(currentScreenData)}
          </View>

          {/* Content */}
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>{currentScreenData.title}</Text>
            <Text style={styles.description}>
              {currentScreenData.description}
            </Text>
          </View>

          {/* Progress Indicators */}
          <View style={styles.progressContainer}>
            {screens.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentScreen && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            <Pressable onPress={handleNext} style={styles.nextButton}>
              {currentScreen === screens.length - 1 ? (
                <Text style={styles.nextText}>Done</Text>
              ) : (
                <Ionicons name="arrow-forward" size={24} color="#007AFF" />
              )}
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#1A1A1A",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  onboardingContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  illustrationWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  imageContainer: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.05)",
    borderRadius: 140,
    padding: 20,
  },
  onboardingImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  // Content Styles
  contentWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3A3A3C",
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: "#007AFF",
    width: 24,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "500",
  },
  nextButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default OnboardingBottomSheet;
