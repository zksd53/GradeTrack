import { View, StyleSheet, Animated } from "react-native";
import { useState, useEffect, useMemo, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext, themes } from "./theme";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SemestersScreen from "./screens/SemestersScreen";
import SemesterDetailScreen from "./screens/SemesterDetailScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CourseDetailScreen from "./screens/CourseDetailScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import AuthScreen from "./screens/AuthScreen";
import SplashScreen from "./screens/SplashScreen";

// UI
import BottomTabBar from "./components/BottomTabBar";

const STORAGE_KEY = "SEMESTERS";
const THEME_KEY = "DARK_MODE";

export default function Root() {
    const [activeTab, setActiveTab] = useState("home");
    const [semesters, setSemesters] = useState([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [splashReady, setSplashReady] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [billing, setBilling] = useState(null);
    const [openPlansOnSettings, setOpenPlansOnSettings] = useState(false);
    const splashOpacity = useRef(new Animated.Value(1)).current;

    const normalizeSemesters = (data) => {
        if (!Array.isArray(data)) return [];
        return data.map((semester) => ({
            ...semester,
            courses: Array.isArray(semester.courses) ? semester.courses : [],
        }));
    };

    const getStorageKey = (uid) => (uid ? `${STORAGE_KEY}_${uid}` : STORAGE_KEY);

    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (storedTheme !== null) {
                setDarkMode(storedTheme === "true");
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        let unsubscribe = null;
        const loadUserData = async () => {
            if (!authUser) {
                setSemesters([]);
                setBilling(null);
                return;
            }
            const storageKey = getStorageKey(authUser.uid);
            const stored = await AsyncStorage.getItem(storageKey);
            const localSemesters = normalizeSemesters(
                stored ? JSON.parse(stored) : []
            );

            const docRef = doc(db, "users", authUser.uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists() && Array.isArray(snapshot.data().semesters)) {
                const data = snapshot.data();
                const remote = normalizeSemesters(data.semesters);
                setSemesters(remote);
                setBilling(data.billing || null);
                await AsyncStorage.setItem(storageKey, JSON.stringify(remote));
            } else if (localSemesters.length) {
                setSemesters(localSemesters);
                setBilling(null);
                await setDoc(
                    docRef,
                    { semesters: localSemesters, updatedAt: serverTimestamp() },
                    { merge: true }
                );
            } else {
                setSemesters([]);
                setBilling(null);
            }

            unsubscribe = onSnapshot(docRef, (liveSnap) => {
                if (!liveSnap.exists()) return;
                const data = liveSnap.data();
                if (!Array.isArray(data.semesters)) return;
                const remote = normalizeSemesters(data.semesters);
                setSemesters(remote);
                setBilling(data.billing || null);
                AsyncStorage.setItem(storageKey, JSON.stringify(remote));
            });
        };
        loadUserData();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [authUser]);

    useEffect(() => {
        AsyncStorage.setItem(THEME_KEY, darkMode ? "true" : "false");
    }, [darkMode]);

    useEffect(() => {
        const timer = setTimeout(() => setSplashReady(true), 1400);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setAuthLoading(false);
        });
        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    // ✅ SAFE state update
    const saveSemesters = async (updater) => {
        setSemesters((prev) => {
            const updated = typeof updater === "function" ? updater(prev) : updater;
            const storageKey = getStorageKey(authUser?.uid);
            AsyncStorage.setItem(storageKey, JSON.stringify(updated));
            if (authUser) {
                setDoc(
                    doc(db, "users", authUser.uid),
                    { semesters: updated, updatedAt: serverTimestamp() },
                    { merge: true }
                );
            }
            return updated;
        });
    };

    const selectedSemester = semesters.find((s) => s.id === selectedSemesterId);
    const selectedCourse =
        selectedSemester &&
        Array.isArray(selectedSemester.courses)
            ? selectedSemester.courses.find((c) => c.id === selectedCourseId)
            : null;

    const theme = useMemo(
        () => (darkMode ? themes.dark : themes.light),
        [darkMode]
    );

    useEffect(() => {
        if (selectedCourseId && !selectedCourse) {
            setSelectedCourseId(null);
        }
    }, [selectedCourseId, selectedCourse]);

    const transition = useRef(new Animated.Value(0)).current;
    const currentScreenKey = useMemo(() => {
        if (activeTab === "home") return "home";
        if (activeTab === "analytics") return "analytics";
        if (activeTab === "settings") return "settings";
        if (activeTab === "semesters") {
            if (selectedCourse) return `course-${selectedCourse.id}`;
            if (selectedSemester) return `semester-${selectedSemester.id}`;
            return "semesters-list";
        }
        return "home";
    }, [activeTab, selectedCourse, selectedSemester]);

    useEffect(() => {
        transition.setValue(0);
        Animated.timing(transition, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
        }).start();
    }, [currentScreenKey, transition]);

    useEffect(() => {
        if (authLoading || !splashReady || !showSplash) return;
        const timer = setTimeout(() => {
            Animated.timing(splashOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start(() => setShowSplash(false));
        }, 1000);
        return () => clearTimeout(timer);
    }, [authLoading, splashReady, showSplash, splashOpacity]);

    if (authLoading || !splashReady) {
        return <SplashScreen />;
    }

    const appContent = authUser ? (
        <ThemeContext.Provider value={{ darkMode, setDarkMode, theme }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Animated.View
                    key={currentScreenKey}
                    style={{
                        flex: 1,
                        opacity: transition,
                        transform: [
                            {
                                translateY: transition.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [12, 0],
                                }),
                            },
                        ],
                    }}
                >
                    {activeTab === "home" && (
                        <HomeScreen
                            semesters={semesters}
                            onOpenCourse={(semesterId, courseId) => {
                                setActiveTab("semesters");
                                setSelectedSemesterId(semesterId);
                                setSelectedCourseId(courseId);
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
                            onUpdateCourse={(semesterId, courseId, updates) => {
                                saveSemesters((prev) =>
                                    prev.map((s) =>
                                        s.id === semesterId
                                            ? {
                                                  ...s,
                                                  courses: (s.courses || []).map((c) =>
                                                      c.id === courseId
                                                          ? { ...c, ...updates }
                                                          : c
                                                  ),
                                              }
                                            : s
                                    )
                                );
                            }}
                            onDeleteAssessment={(
                                semesterId,
                                courseId,
                                assessmentId
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
                                                                ).filter(
                                                                    (a) => a.id !== assessmentId
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

                    {activeTab === "semesters" && !selectedSemester && (
                        <SemestersScreen
                            semesters={semesters}
                            billing={billing}
                            saveSemesters={saveSemesters}
                            onOpenPlans={() => {
                                setActiveTab("settings");
                                setOpenPlansOnSettings(true);
                            }}
                            onOpenSemester={(id) => {
                                setSelectedSemesterId(id);
                                setSelectedCourseId(null);
                            }}
                        />
                    )}

                    {activeTab === "semesters" &&
                        selectedSemester &&
                        !selectedCourse && (
                            <SemesterDetailScreen
                                key={selectedSemester.id}
                                semester={selectedSemester}
                                onBack={() => {
                                    setSelectedSemesterId(null);
                                    setSelectedCourseId(null);
                                }}
                                onDelete={(id) => {
                                    saveSemesters((prev) =>
                                        prev.filter((s) => s.id !== id)
                                    );
                                    setSelectedSemesterId(null);
                                }}
                                onAddCourse={(semesterId, course) => {
                                    saveSemesters((prev) =>
                                        prev.map((s) =>
                                            s.id === semesterId
                                                ? {
                                                    ...s,
                                                    courses: [
                                                        ...(Array.isArray(s.courses)
                                                            ? s.courses
                                                            : []),
                                                        course,
                                                    ],
                                                }
                                                : s
                                        )
                                    );
                                }}
                                onOpenCourse={(courseId) =>
                                    setSelectedCourseId(courseId)
                                }
                            />
                        )}

                    {activeTab === "semesters" && selectedSemester && selectedCourse && (
                        <CourseDetailScreen
                            semesterId={selectedSemester.id}
                            course={selectedCourse}
                            semesterCourses={selectedSemester.courses || []}
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
                                                                ...(Array.isArray(
                                                                    c.assessments
                                                                )
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

                    {activeTab === "settings" && (
                        <SettingsScreen
                            semesters={semesters}
                            user={authUser}
                            billing={billing}
                            openPlans={openPlansOnSettings}
                            onPlansOpened={() => setOpenPlansOnSettings(false)}
                            onClearAll={() => {
                                saveSemesters([]);
                            }}
                            onSignOut={() => signOut(auth)}
                        />
                    )}

                    {activeTab === "analytics" && <AnalyticsScreen />}
                </Animated.View>

                <BottomTabBar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </View>
        </ThemeContext.Provider>
    ) : (
        <AuthScreen />
    );

    return (
        <View style={styles.root}>
            {appContent}
            {showSplash && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        { opacity: splashOpacity },
                    ]}
                >
                    <SplashScreen />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#969cb1ff",
    },
});
