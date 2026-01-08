import { View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SemestersScreen from "./screens/SemestersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SemesterDetailScreen from "./screens/SemesterDetailScreen";

// UI
import BottomTabBar from "./components/BottomTabBar";

const STORAGE_KEY = "SEMESTERS";

export default function Root() {
    const [activeTab, setActiveTab] = useState("home");
    const [selectedSemesterId, setSelectedSemesterId] = useState(null);
    const [semesters, setSemesters] = useState([]);

    /* ---------- Load once ---------- */
    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) setSemesters(JSON.parse(stored));
        };
        load();
    }, []);

    /* ---------- Derived ---------- */
    const selectedSemester = semesters.find(
        (s) => s.id === selectedSemesterId
    );

    /* ---------- Handlers ---------- */

    const handleAddSemester = async (newSemester) => {
        const updated = [...semesters, newSemester];
        setSemesters(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleAddCourse = async (semesterId, newCourse) => {
        const updated = semesters.map((s) =>
            s.id === semesterId
                ? { ...s, courses: [...(s.courses || []), newCourse] }
                : s
        );

        setSemesters(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleDeleteSemester = async (semesterId) => {
        const updated = semesters.filter((s) => s.id !== semesterId);
        setSemesters(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setSelectedSemesterId(null);
    };

    /* ---------- Render ---------- */

    const renderScreen = () => {
        switch (activeTab) {
            case "home":
                return <HomeScreen />;

            case "semesters":
                if (selectedSemesterId && selectedSemester) {
                    return (
                        <SemesterDetailScreen
                            semester={selectedSemester}
                            onBack={() => setSelectedSemesterId(null)}
                            onDelete={handleDeleteSemester}
                            onAddCourse={handleAddCourse}
                        />
                    );
                }

                return (
                    <SemestersScreen
                        semesters={semesters}
                        onOpenSemester={(id) => setSelectedSemesterId(id)}
                        onAddSemester={handleAddSemester}
                    />
                );

            case "settings":
                return <SettingsScreen />;

            default:
                return <HomeScreen />;
        }
    };

    return (
        <View style={styles.container}>
            {renderScreen()}
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
