import { View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SemestersScreen from "./screens/SemestersScreen";
import SettingsScreen from "./screens/SettingsScreen";

// UI
import BottomTabBar from "./components/BottomTabBar";

const STORAGE_KEY = "SEMESTERS";

export default function Root() {
    const [activeTab, setActiveTab] = useState("home");
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) setSemesters(JSON.parse(stored));
        };
        load();
    }, []);

    const saveSemesters = async (updated) => {
        setSemesters(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return (
        <View style={styles.container}>
            {activeTab === "home" && <HomeScreen />}

            {activeTab === "semesters" && (
                <SemestersScreen
                    semesters={semesters}
                    saveSemesters={saveSemesters}
                />
            )}

            {activeTab === "settings" && <SettingsScreen />}

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
