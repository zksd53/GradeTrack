import { View, StyleSheet } from "react-native";
import { useState } from "react";

import BottomTabBar from "../components/BottomTabBar";
import HomeScreen from "../screens/HomeScreen";
import SemestersScreen from "../screens/SemestersScreen";
import SettingsScreen from "../screens/SettingsScreen";

const TAB_BAR_HEIGHT = 70;

export default function MainLayout() {
    const [activeTab, setActiveTab] = useState("home");

    let Screen = null;
    if (activeTab === "home") Screen = <HomeScreen />;
    if (activeTab === "semesters") Screen = <SemestersScreen />;
    if (activeTab === "settings") Screen = <SettingsScreen />;

    return (
        <View style={styles.container}>
            {/* Screen content */}
            <View style={styles.content}>{Screen}</View>

            {/* Bottom tab bar (ONLY visible base) */}
            <BottomTabBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                height={TAB_BAR_HEIGHT}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B1020",
    },
    content: {
        flex: 1,
        paddingBottom: TAB_BAR_HEIGHT,
        backgroundColor: "transparent", // IMPORTANT
    },
});
