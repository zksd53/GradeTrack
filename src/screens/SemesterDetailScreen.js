import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useMemo, useState } from "react";
import NewCourseSheet from "../components/NewCourseSheet";
import { ThemeContext } from "../theme";

export default function SemesterDetailScreen({
    semester,
    onBack,
    onDelete,
    onAddCourse,
    onOpenCourse,
}) {
    const [showDelete, setShowDelete] = useState(false);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [circleModeByCourse, setCircleModeByCourse] = useState({});
    const { theme } = useContext(ThemeContext);

    // ALWAYS derive from props (single source of truth)
    const courses = Array.isArray(semester.courses)
        ? semester.courses
        : [];


    const totalCredits = courses.reduce(
        (sum, c) => sum + (Number(c?.credits) || 0),
        0
    );

    const metrics = useMemo(() => {
        const assessments = courses.flatMap((course) =>
            Array.isArray(course.assessments) ? course.assessments : []
        );
        const totalWeight = 100;
        const completedWeight = assessments.reduce(
            (sum, a) =>
                sum + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
            0
        );
        const gained = assessments.reduce((sum, a) => {
            if (typeof a.score !== "number") return sum;
            const weight = Number(a.weight) || 0;
            return sum + (weight * a.score) / 100;
        }, 0);
        const lost = Math.max(0, completedWeight - gained);
        const progressRatio =
            totalWeight > 0 ? completedWeight / totalWeight : 0;
        const coursesComplete = courses.every((course) => {
            const courseAssessments = Array.isArray(course.assessments)
                ? course.assessments
                : [];
            const courseCompletedWeight = courseAssessments.reduce(
                (sum, a) =>
                    sum +
                    (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
                0
            );
            return courseCompletedWeight >= 100;
        });

        return {
            gained,
            lost,
            completedWeight,
            totalWeight,
            progressRatio,
            coursesComplete,
        };
    }, [courses]);

    const formatGpa = (value) => {
        if (value === null || Number.isNaN(value)) return "0.00";
        return value.toFixed(2);
    };

    const courseGpa = useMemo(() => {
        if (courses.length === 0) return null;
        const weighted = courses.reduce((sum, course) => {
            const assessments = Array.isArray(course.assessments)
                ? course.assessments
                : [];
            const completedWeight = assessments.reduce(
                (inner, a) =>
                    inner + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
                0
            );
            const gained = assessments.reduce((inner, a) => {
                if (typeof a.score !== "number") return inner;
                const weight = Number(a.weight) || 0;
                return inner + (weight * a.score) / 100;
            }, 0);
            if (completedWeight < 100) return sum;
            const percent = (gained / completedWeight) * 100;
            let gpa = 0;
            if (percent >= 90) gpa = 4.0;
            else if (percent >= 85) gpa = 3.7;
            else if (percent >= 80) gpa = 3.3;
            else if (percent >= 75) gpa = 3.0;
            else if (percent >= 70) gpa = 2.7;
            else if (percent >= 65) gpa = 2.3;
            else if (percent >= 60) gpa = 2.0;
            else if (percent >= 55) gpa = 1.0;
            return sum + gpa * (Number(course.credits) || 0);
        }, 0);
        const creditTotal = courses.reduce((sum, course) => {
            const assessments = Array.isArray(course.assessments)
                ? course.assessments
                : [];
            const completedWeight = assessments.reduce(
                (inner, a) =>
                    inner +
                    (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
                0
            );
            if (completedWeight < 100) return sum;
            return sum + (Number(course.credits) || 0);
        }, 0);
        if (creditTotal === 0) return null;
        return weighted / creditTotal;
    }, [courses]);

    const showGpa = courses.some((course) => {
        const courseAssessments = Array.isArray(course.assessments)
            ? course.assessments
            : [];
        const courseCompletedWeight = courseAssessments.reduce(
            (sum, a) =>
                sum + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
            0
        );
        return courseCompletedWeight >= 100;
    });

    const formatPercent = (value) => {
        if (value === null || Number.isNaN(value)) return "0";
        const rounded = Math.round(value * 10) / 10;
        return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    };

    const getCourseMetrics = (course) => {
        const assessments = Array.isArray(course.assessments)
            ? course.assessments
            : [];
        const totalWeight = assessments.reduce(
            (sum, a) => sum + (Number(a.weight) || 0),
            0
        );
        const completedWeight = assessments.reduce(
            (sum, a) =>
                sum + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
            0
        );
        const gained = assessments.reduce((sum, a) => {
            if (typeof a.score !== "number") return sum;
            const weight = Number(a.weight) || 0;
            return sum + (weight * a.score) / 100;
        }, 0);
        const lost = Math.max(0, completedWeight - gained);
        const progressPercent =
            totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
        return { completedWeight, gained, lost, progressPercent };
    };

    const getDisplayMode = (course) => {
        const mode = circleModeByCourse[course.id] || "progress";
        const courseMetrics = getCourseMetrics(course);
        const mapping = {
            progress: {
                percent: courseMetrics.progressPercent,
                color: "#F59E0B",
                textColor: "#F59E0B",
            },
            gain: {
                percent: courseMetrics.gained,
                color: "#10B981",
                textColor: "#10B981",
            },
            loss: {
                percent: courseMetrics.lost,
                color: "#EF4444",
                textColor: "#EF4444",
            },
        };
        return mapping[mode];
    };

    const handleCirclePress = (courseId) => {
        setCircleModeByCourse((prev) => {
            const current = prev[courseId] || "progress";
            const next =
                current === "progress"
                    ? "gain"
                    : current === "gain"
                        ? "loss"
                        : "progress";
            return { ...prev, [courseId]: next };
        });
    };

    const ProgressRing = ({ value, progress, color, theme }) => {
        const progressAngle = Math.min(360, Math.max(0, progress * 3.6));
        const rightRotation = progressAngle <= 180 ? progressAngle : 180;
        const leftRotation = progressAngle > 180 ? progressAngle - 180 : 0;
        return (
            <View style={styles.ring}>
                <View style={styles.ringHalf}>
                    <View
                        style={[
                            styles.ringCircle,
                            styles.ringRight,
                            { borderColor: color },
                            {
                                borderLeftColor: theme.border,
                                borderBottomColor: theme.border,
                            },
                            { transform: [{ rotate: `${rightRotation}deg` }] },
                        ]}
                    />
                </View>
                <View style={styles.ringHalf}>
                    <View
                        style={[
                            styles.ringCircle,
                            styles.ringLeft,
                            { borderColor: color },
                            {
                                borderRightColor: theme.border,
                                borderTopColor: theme.border,
                            },
                            { transform: [{ rotate: `${leftRotation}deg` }] },
                        ]}
                    />
                </View>
                <View
                    style={[styles.ringInner, { backgroundColor: theme.card }]}
                >
                    <Text style={[styles.ringValue, { color: theme.text }]}>
                        {value}
                    </Text>
                </View>
            </View>
        );
    };


    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ---------- Header ---------- */}
                <View style={styles.header}>
                    <Pressable onPress={onBack}>
                        <Ionicons name="chevron-back" size={24} color={theme.text} />
                    </Pressable>

                    <View style={styles.headerCenter}>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {semester.term} {semester.year}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.muted }]}>
                            {courses.length} course{courses.length !== 1 ? "s" : ""} •{" "}
                            {totalCredits} credits
                        </Text>
                    </View>

                    <Pressable onPress={() => setShowDelete(true)}>
                        <Ionicons name="trash-outline" size={22} color={theme.text} />
                    </Pressable>
                </View>

                {/* ---------- GPA Card ---------- */}
                <View style={[styles.gpaCard, { backgroundColor: theme.card }]}>
                    <View style={[styles.gpaCircle, { borderColor: theme.border }]}>
                        <Text style={[styles.gpaText, { color: theme.text }]}>
                            {showGpa ? formatGpa(courseGpa) : "0.00"}
                        </Text>
                    </View>
                    <Text style={[styles.gpaLabel, { color: theme.muted }]}>
                        Semester GPA
                    </Text>
                    <Text style={[styles.creditText, { color: theme.muted }]}>
                        {totalCredits} credits
                    </Text>
                </View>

                {/* ---------- Add Course ---------- */}
                <Pressable
                    style={[styles.addCourseButton, { backgroundColor: theme.accent }]}
                    onPress={() => setShowAddCourse(true)}
                >
                    <Ionicons name="add" size={20} color="#FFF" />
                    <Text style={styles.addCourseText}>Add Course</Text>
                </Pressable>

                {/* ---------- Empty State ---------- */}
                {courses.length === 0 && (
                    <View style={styles.empty}>
                        <Text style={styles.book}>📖</Text>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            No courses yet
                        </Text>
                        <Text style={[styles.emptySub, { color: theme.muted }]}>
                            Add courses to start tracking your grades for this semester
                        </Text>
                    </View>
                )}

                {/* ---------- Courses List ---------- */}
                {courses.map((course) => (
                    <Pressable
                        key={course.id}
                        style={[styles.courseCard, { backgroundColor: theme.card }]}
                        onPress={() => onOpenCourse(course.id)}
                    >
                        <View style={styles.courseLeft}>
                            <Pressable
                                onPress={() => handleCirclePress(course.id)}
                            >
                                {getDisplayMode(course).percent <= 0 ? (
                                    <View
                                        style={[
                                            styles.progressCircle,
                                            { borderColor: theme.border },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.progressText,
                                                { color: theme.text },
                                            ]}
                                        >
                                            0%
                                        </Text>
                                    </View>
                                ) : (
                                    <ProgressRing
                                        value={`${formatPercent(
                                            getDisplayMode(course).percent
                                        )}%`}
                                        progress={getDisplayMode(course).percent}
                                        color={getDisplayMode(course).color}
                                        theme={theme}
                                    />
                                )}
                            </Pressable>
                        </View>

                        <View style={styles.courseInfo}>
                            <Text style={[styles.courseTitle, { color: theme.text }]}>
                                {course.name}
                            </Text>
                            <Text style={[styles.courseCode, { color: theme.muted }]}>
                                {course.code || "—"}
                            </Text>
                            <Text style={[styles.courseCredits, { color: theme.muted }]}>
                                {course.credits} credits
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={theme.muted}
                        />
                    </Pressable>
                ))}
            </ScrollView>

            {/* ---------- Delete Confirmation ---------- */}
            {showDelete && (
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Delete Semester?</Text>

                        <Text style={styles.modalText}>
                            This will permanently delete {semester.term} {semester.year} and
                            all its courses. This action cannot be undone.
                        </Text>

                        <Pressable
                            style={styles.deleteBtn}
                            onPress={() => onDelete(semester.id)}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelBtn}
                            onPress={() => setShowDelete(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* ---------- New Course Sheet ---------- */}
            <NewCourseSheet
                visible={showAddCourse}
                onClose={() => setShowAddCourse(false)}
                onCreate={(course) => onAddCourse(semester.id, course)}
            />
        </SafeAreaView>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#F7F8FC",
    },

    scroll: {
        padding: 16,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    headerCenter: {
        alignItems: "center",
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
    },

    subtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },

    gpaCard: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        marginBottom: 24,
    },

    gpaCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 10,
        borderColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
    },

    gpaText: {
        fontSize: 32,
        fontWeight: "700",
    },

    gpaLabel: {
        marginTop: 12,
        fontSize: 14,
        color: "#6B7280",
    },

    creditText: {
        fontSize: 13,
        color: "#9CA3AF",
        marginTop: 2,
    },

    addCourseButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 16,
        gap: 8,
        marginBottom: 32,
    },

    addCourseText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "600",
    },

    empty: {
        alignItems: "center",
        marginTop: 10,
    },

    book: {
        fontSize: 40,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: "600",
    },

    emptySub: {
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 6,
        maxWidth: 260,
    },

    courseCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
    },

    courseLeft: {
        marginRight: 12,
    },

    progressCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 4,
        borderColor: "#CBD5E1",
        alignItems: "center",
        justifyContent: "center",
    },

    progressText: {
        fontSize: 12,
        fontWeight: "700",
    },

    ring: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    ringHalf: {
        position: "absolute",
        width: 44,
        height: 44,
        overflow: "hidden",
    },
    ringCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 4,
    },
    ringRight: {
        position: "absolute",
        right: 0,
    },
    ringLeft: {
        position: "absolute",
        left: 0,
    },
    ringInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    ringValue: {
        fontSize: 11,
        fontWeight: "700",
    },

    courseInfo: {
        flex: 1,
    },

    courseTitle: {
        fontSize: 15,
        fontWeight: "600",
    },

    courseCode: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },

    courseCredits: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        width: "85%",
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 24,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },

    modalText: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 20,
    },

    deleteBtn: {
        backgroundColor: "#EF4444",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
    },

    deleteText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "600",
    },

    cancelBtn: {
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    cancelText: {
        fontSize: 15,
        fontWeight: "600",
    },
});
