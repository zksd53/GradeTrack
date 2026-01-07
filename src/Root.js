import { View, StyleSheet } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SemestersScreen from "./screens/SemestersScreen";
import SettingsScreen from "./screens/SettingsScreen.js";
import SemesterDetailScreen from "./screens/SemesterDetailScreen";

// // Layout & UI
// import MainLayout from "./src/layout/MainLayout";
import BottomTabBar from "./components/BottomTabBar.js";
const STORAGE_KEY = "SEMESTERS";

export default function Root() {
    const [activeTab, setActiveTab] = useState("home");
    const [selectedSemester, setSelectedSemester] = useState(null);

    const renderScreen = () => {
        switch (activeTab) {
            case "home":
                return <HomeScreen />;
            case "semesters":
                if (selectedSemester) {
                    return (
                        <SemesterDetailScreen
                            semester={selectedSemester}
                            onBack={() => setSelectedSemester(null)}
                            onDelete={handleDeleteSemester}
                            onAddCourse={handleAddCourse}   // 👈 THIS LINE WAS MISSING
                        />
                    );

                }
                return (
                    <SemestersScreen
                        onOpenSemester={setSelectedSemester}
                    />
                );
            case "settings":
                return <SettingsScreen />;
            default:
                return <HomeScreen />;
        }
    };
    const handleAddCourse = async (semesterId, newCourse) => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (!stored) return;

            const semesters = JSON.parse(stored);

            const updated = semesters.map((s) => {
                if (s.id === semesterId) {
                    return {
                        ...s,
                        courses: s.courses ? [...s.courses, newCourse] : [newCourse],
                    };
                }
                return s;
            });

            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updated)
            );

            // update selected semester in UI
            const updatedSemester = updated.find(
                (s) => s.id === semesterId
            );
            setSelectedSemester(updatedSemester);
        } catch (e) {
            console.log("Add course failed", e);
        }
    };

    const handleDeleteSemester = async (semesterId) => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (!stored) return;

            const semesters = JSON.parse(stored);

            const updated = semesters.filter(
                (s) => s.id !== semesterId
            );

            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updated)
            );

            // Detail screen close → list pe wapas
            setSelectedSemester(null);
        } catch (e) {
            console.log("Delete failed", e);
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
