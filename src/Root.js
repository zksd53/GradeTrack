import { View, StyleSheet } from "react-native";
import { useState } from "react";

// Screens
// import HomeScreen from "./src/screens/HomeScreen";
// import SemestersScreen from "./src/screens/SemestersScreen";
// import SettingsScreen from "./src/screens/SettingsScreen";

// // Layout & UI
// import MainLayout from "./src/layout/MainLayout";
import BottomTabBar from "./components/BottomTabBar.js";

export default function Root() {
  const [activeTab, setActiveTab] = useState("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        // return <HomeScreen />;
      case "semesters":
        // return <SemestersScreen />;
      case "settings":
        // return <SettingsScreen />;
      default:
        // return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      {/* <MainLayout>
        {renderScreen()}
      </MainLayout> */}

      {/* Fixed Bottom Tabs */}
      <BottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#969cb1ff",
  },
});
