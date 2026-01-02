import { View, StyleSheet } from "react-native";
import { useState } from "react";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SemestersScreen from "./screens/SemestersScreen";
import SettingsScreen from "./screens/SettingsScreen.js";

// // Layout & UI
// import MainLayout from "./src/layout/MainLayout";
import BottomTabBar from "./components/BottomTabBar.js";

export default function Root() {
    const [activeTab, setActiveTab] = useState("home");

    const renderScreen = () => {
        switch (activeTab) {
            case "home":
            return <HomeScreen />;
            case "semesters":
                return <SemestersScreen />;
            case "settings":
                return <SettingsScreen />;
            default:
            return <HomeScreen />;
        }
    };

    return (
        <View style={styles.container}>
            {/* ONLY ONE screen at a time */}
            {renderScreen()}

            {/* Bottom tabs always visible */}
            <BottomTabBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#969cb1ff",
    },
});
