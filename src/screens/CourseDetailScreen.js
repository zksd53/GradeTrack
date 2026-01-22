import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
    Animated,
} from "react-native";
import { useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import NewAssessmentSheet from "../components/NewAssessmentSheet";
import EditAssessmentScoreSheet from "../components/EditAssessmentScoreSheet";
import UpdateAssessmentSheet from "../components/UpdateAssessmentSheet";

export default function CourseDetailScreen({
    semesterId,
    course,
    semesterCourses,
    onBack,
    onDeleteCourse,
    onAddAssessment,
    onUpdateAssessment,
}) {
    const [showAddAssessment, setShowAddAssessment] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [showEditScore, setShowEditScore] = useState(false);
    const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
    const [circleMode, setCircleMode] = useState("progress");
    const rotation = useRef(new Animated.Value(0)).current;
    const rotationStep = useRef(0);

    const assessments = Array.isArray(course.assessments)
        ? course.assessments
        : [];

    const metrics = useMemo(() => {
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
        const currentPercent =
            completedWeight > 0 ? (gained / completedWeight) * 100 : null;
        return {
            totalWeight,
            completedWeight,
            gained,
            lost,
            currentPercent,
        };
    }, [assessments]);

    const displayMode = {
        progress: {
            label: "Progress",
            percent: metrics.completedWeight,
            color: "#E5E7EB",
            textColor: "#111827",
        },
        gain: {
            label: "Gained",
            percent: metrics.gained,
            color: "#10B981",
            textColor: "#10B981",
        },
        loss: {
            label: "Lost",
            percent: metrics.lost,
            color: "#EF4444",
            textColor: "#EF4444",
        },
    }[circleMode];

    const currentGrade = useMemo(() => {
        if (metrics.currentPercent === null) return null;
        const pct = metrics.currentPercent;
        if (pct >= 90) return "A";
        if (pct >= 85) return "A-";
        if (pct >= 80) return "B+";
        if (pct >= 75) return "B";
        if (pct >= 70) return "B-";
        if (pct >= 65) return "C+";
        if (pct >= 60) return "C";
        if (pct >= 55) return "D";
        return "F";
    }, [metrics.currentPercent]);

    const handleCirclePress = () => {
        const nextMode =
            circleMode === "progress"
                ? "gain"
                : circleMode === "gain"
                    ? "loss"
                    : "progress";
        setCircleMode(nextMode);
        rotationStep.current += 1;
        Animated.timing(rotation, {
            toValue: rotationStep.current,
            duration: 220,
            useNativeDriver: true,
        }).start();
    };

    const rotationStyle = {
        transform: [
            {
                rotate: rotation.interpolate({
                    inputRange: [0, 1, 2, 3],
                    outputRange: ["0deg", "120deg", "240deg", "360deg"],
                    extrapolate: "extend",
                }),
            },
        ],
    };

    const openEditScore = (assessment) => {
        setEditingAssessment(assessment);
        setShowEditScore(true);
    };

    const handleSaveScore = (nextScore) => {
        if (!editingAssessment) return;
        onUpdateAssessment(
            semesterId,
            course.id,
            editingAssessment.id,
            { score: nextScore }
        );
    };

    const showCurrentGrade = metrics.currentPercent !== null;

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable onPress={onBack}>
                        <Ionicons name="chevron-back" size={24} color="#111827" />
                    </Pressable>

                    <View style={styles.headerText}>
                        <Text style={styles.title}>{course.name}</Text>
                        <Text style={styles.subtitle}>{course.code || "—"}</Text>
                    </View>

                    <Pressable onPress={() => setShowUpdateAssessment(true)}>
                        <Text style={styles.updateText}>Update Assessment</Text>
                    </Pressable>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.badgesRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {course.credits || 0} credits
                            </Text>
                        </View>
                        <View style={styles.badgeAccent}>
                            <Text style={styles.badgeAccentText}>
                                Target: {course.targetGrade || "—"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.summaryRow}>
                        <View>
                            {showCurrentGrade ? (
                                <>
                                    <Text style={styles.gradeText}>
                                        {currentGrade}{" "}
                                        <Text style={styles.gradePercent}>
                                            ({metrics.currentPercent.toFixed(1)}%)
                                        </Text>
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.summaryText}>No grades yet</Text>
                            )}
                        </View>
                        <Pressable onPress={handleCirclePress}>
                            <Animated.View
                                style={[
                                    styles.progressCircle,
                                    rotationStyle,
                                    { borderColor: displayMode.color },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressText,
                                        { color: displayMode.textColor },
                                    ]}
                                >
                                    {Math.round(displayMode.percent)}%
                                </Text>
                            </Animated.View>
                        </Pressable>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.instructor}>
                        Instructor: {course.instructor || "—"}
                    </Text>
                </View>

                <Pressable
                    style={styles.addAssessmentButton}
                    onPress={() => setShowAddAssessment(true)}
                >
                    <Ionicons name="add" size={20} color="#FFF" />
                    <Text style={styles.addAssessmentText}>Add Assessment</Text>
                </Pressable>

                {assessments.length === 0 && (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyTitle}>No assessments yet</Text>
                        <Text style={styles.emptySub}>
                            Add assignments, quizzes, and exams to track your progress
                        </Text>
                    </View>
                )}

                {assessments.map((assessment) => (
                    <View key={assessment.id} style={styles.assessmentCard}>
                        <View>
                            <Text style={styles.assessmentTitle}>
                                {assessment.name}
                            </Text>
                            <Text style={styles.assessmentMeta}>
                                {assessment.type} • {assessment.weight}%{" "}
                                {typeof assessment.score === "number"
                                    ? `• Score: ${assessment.score}%`
                                    : ""}
                            </Text>
                        </View>
                        <View style={styles.assessmentActions}>
                            <Pressable
                                style={styles.iconButton}
                                onPress={() => openEditScore(assessment)}
                            >
                                <Ionicons
                                    name="create-outline"
                                    size={18}
                                    color="#6B7280"
                                />
                            </Pressable>
                            <Text style={styles.assessmentStatus}>
                                {typeof assessment.score === "number"
                                    ? "Completed"
                                    : "Planned"}
                            </Text>
                        </View>
                    </View>
                ))}

                <Pressable
                    style={styles.deleteRow}
                    onPress={() => onDeleteCourse(semesterId, course.id)}
                >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.deleteText}>Delete Course</Text>
                </Pressable>
            </ScrollView>

            <NewAssessmentSheet
                visible={showAddAssessment}
                onClose={() => setShowAddAssessment(false)}
                onCreate={(assessment) =>
                    onAddAssessment(semesterId, course.id, assessment)
                }
            />
            <EditAssessmentScoreSheet
                visible={showEditScore}
                assessment={editingAssessment}
                onClose={() => {
                    setShowEditScore(false);
                    setEditingAssessment(null);
                }}
                onSave={handleSaveScore}
            />
            <UpdateAssessmentSheet
                visible={showUpdateAssessment}
                onClose={() => setShowUpdateAssessment(false)}
                courses={semesterCourses}
                onSave={(courseId, assessmentId, score) =>
                    onUpdateAssessment(semesterId, courseId, assessmentId, {
                        score,
                    })
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F7F8FC" },
    scroll: { padding: 16, paddingBottom: 32 },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    headerText: { flex: 1, marginLeft: 12 },
    title: { fontSize: 20, fontWeight: "700" },
    subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    updateText: { fontSize: 12, fontWeight: "600", color: "#2563EB" },

    summaryCard: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 20,
    },
    badgesRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },
    badge: {
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    badgeText: { fontSize: 12, fontWeight: "600", color: "#111827" },
    badgeAccent: {
        backgroundColor: "#FEF3C7",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    badgeAccentText: { fontSize: 12, fontWeight: "600", color: "#B45309" },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    summaryText: { fontSize: 14, color: "#6B7280" },
    gradeText: { fontSize: 24, fontWeight: "700", color: "#111827" },
    gradePercent: { fontSize: 16, color: "#6B7280" },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 6,
        borderColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
    },
    progressText: { fontSize: 12, fontWeight: "700" },

    divider: {
        height: 1,
        backgroundColor: "#EEF2F7",
        marginBottom: 10,
    },
    instructor: { fontSize: 13, color: "#6B7280" },

    addAssessmentButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 16,
        gap: 8,
        marginBottom: 24,
    },
    addAssessmentText: { color: "#FFF", fontSize: 15, fontWeight: "600" },

    empty: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 24,
    },
    emptyIcon: { fontSize: 36, marginBottom: 10 },
    emptyTitle: { fontSize: 16, fontWeight: "600" },
    emptySub: {
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 6,
        maxWidth: 260,
    },

    assessmentCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    assessmentTitle: { fontSize: 14, fontWeight: "600" },
    assessmentMeta: { fontSize: 12, color: "#6B7280", marginTop: 4 },
    assessmentStatus: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
    assessmentActions: {
        alignItems: "flex-end",
        gap: 6,
    },
    iconButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: "#F3F4F6",
    },

    deleteRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 20,
    },
    deleteText: { color: "#EF4444", fontSize: 14, fontWeight: "600" },
});
