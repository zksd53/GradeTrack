import { View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SemestersScreen from "./screens/SemestersScreen";
import SemesterDetailScreen from "./screens/SemesterDetailScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CourseDetailScreen from "./screens/CourseDetailScreen";

// UI
import BottomTabBar from "./components/BottomTabBar";

const STORAGE_KEY = "SEMESTERS";

export default function Root() {
    const [activeTab, setActiveTab] = useState("home");
    const [semesters, setSemesters] = useState([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const normalized = Array.isArray(parsed)
                    ? parsed.map((semester) => ({
                        ...semester,
                        courses: Array.isArray(semester.courses)
                            ? semester.courses
                            : [],
                    }))
                    : [];
                setSemesters(normalized);
            }
        };
        load();
    }, []);

    // ✅ SAFE state update
    const saveSemesters = async (updater) => {
        setSemesters((prev) => {
            const updated = typeof updater === "function" ? updater(prev) : updater;
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const selectedSemester = semesters.find(
        (s) => s.id === selectedSemesterId
    );
    const selectedCourse =
        selectedSemester &&
        Array.isArray(selectedSemester.courses)
            ? selectedSemester.courses.find((c) => c.id === selectedCourseId)
            : null;

    useEffect(() => {
        if (selectedCourseId && !selectedCourse) {
            setSelectedCourseId(null);
        }
    }, [selectedCourseId, selectedCourse]);

    return (
        <View style={styles.container}>
            {activeTab === "home" && <HomeScreen />}

            {activeTab === "semesters" && !selectedSemester && (
                <SemestersScreen
                    semesters={semesters}
                    saveSemesters={saveSemesters}
                    onOpenSemester={(id) => {
                        setSelectedSemesterId(id);
                        setSelectedCourseId(null);
                    }}
                />
            )}

            {activeTab === "semesters" && selectedSemester && !selectedCourse && (
                <SemesterDetailScreen
                    key={selectedSemester.id}
                    semester={selectedSemester}
                    onBack={() => {
                        setSelectedSemesterId(null);
                        setSelectedCourseId(null);
                    }}
                    onDelete={(id) => {
                        saveSemesters((prev) => prev.filter((s) => s.id !== id));
                        setSelectedSemesterId(null);
                    }}
                    onAddCourse={(semesterId, course) => {
                        saveSemesters((prev) =>
                            prev.map((s) =>
                                s.id === semesterId
                                    ? {
                                        ...s,
                                        courses: [
                                            ...(Array.isArray(s.courses) ? s.courses : []),
                                            course,
                                        ],
                                    }
                                    : s
                            )
                        );
                    }}
                    onOpenCourse={(courseId) => setSelectedCourseId(courseId)}
                />
            )}

            {activeTab === "semesters" && selectedSemester && selectedCourse && (
                <CourseDetailScreen
                    semesterId={selectedSemester.id}
                    course={selectedCourse}
                    onBack={() => setSelectedCourseId(null)}
                    onDeleteCourse={(semesterId, courseId) => {
                        saveSemesters((prev) =>
                            prev.map((s) =>
                                s.id === semesterId
                                    ? {
                                        ...s,
                                        courses: (s.courses || []).filter(
                                            (c) => c.id !== courseId
                                        ),
                                    }
                                    : s
                            )
                        );
                        setSelectedCourseId(null);
                    }}
                    onAddAssessment={(semesterId, courseId, assessment) => {
                        saveSemesters((prev) =>
                            prev.map((s) =>
                                s.id === semesterId
                                    ? {
                                        ...s,
                                        courses: (s.courses || []).map((c) =>
                                            c.id === courseId
                                                ? {
                                                    ...c,
                                                    assessments: [
                                                        ...(Array.isArray(c.assessments)
                                                            ? c.assessments
                                                            : []),
                                                        assessment,
                                                    ],
                                                }
                                                : c
                                        ),
                                    }
                                    : s
                            )
                        );
                    }}
                    onUpdateAssessment={(
                        semesterId,
                        courseId,
                        assessmentId,
                        updates
                    ) => {
                        saveSemesters((prev) =>
                            prev.map((s) =>
                                s.id === semesterId
                                    ? {
                                        ...s,
                                        courses: (s.courses || []).map((c) =>
                                            c.id === courseId
                                                ? {
                                                    ...c,
                                                    assessments: (
                                                        c.assessments || []
                                                    ).map((a) =>
                                                        a.id === assessmentId
                                                            ? { ...a, ...updates }
                                                            : a
                                                    ),
                                                }
                                                : c
                                        ),
                                    }
                                    : s
                            )
                        );
                    }}
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
