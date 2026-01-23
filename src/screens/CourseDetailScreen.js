import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { useContext, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import NewAssessmentSheet from "../components/NewAssessmentSheet";
import EditAssessmentScoreSheet from "../components/EditAssessmentScoreSheet";
import UpdateAssessmentSheet from "../components/UpdateAssessmentSheet";
import EditGradeDistributionSheet from "../components/EditGradeDistributionSheet";
import { ThemeContext } from "../theme";

export default function CourseDetailScreen({
    semesterId,
    course,
    semesterCourses,
    onBack,
    onDeleteCourse,
    onAddAssessment,
    onUpdateAssessment,
    onDeleteAssessment,
    onUpdateCourse,
}) {
    const [showAddAssessment, setShowAddAssessment] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [showEditScore, setShowEditScore] = useState(false);
    const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
    const [showGradeDistribution, setShowGradeDistribution] = useState(false);
    const { theme } = useContext(ThemeContext);
    const [circleMode, setCircleMode] = useState("progress");

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
            color: "#F59E0B",
            textColor: "#F59E0B",
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

    const formatPercent = (value) => {
        if (value === null || Number.isNaN(value)) return "0";
        const rounded = Math.round(value * 10) / 10;
        return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    };

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

    const showCurrentGrade =
        metrics.currentPercent !== null && metrics.completedWeight >= 100;

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable onPress={onBack}>
                        <Ionicons name="chevron-back" size={24} color={theme.text} />
                    </Pressable>

                    <View style={styles.headerText}>
                        <Text style={[styles.title, { color: theme.text }]}>{course.name}</Text>
                        <Text style={[styles.subtitle, { color: theme.muted }]}>
                            {course.code || "—"}
                        </Text>
                    </View>

                    <Pressable onPress={() => setShowUpdateAssessment(true)}>
                        <Text style={[styles.updateText, { color: theme.accent }]}>
                            Update Assessment
                        </Text>
                    </Pressable>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                    <View style={styles.badgesRow}>
                        <View style={[styles.badge, { backgroundColor: theme.cardAlt }]}>
                            <Text style={[styles.badgeText, { color: theme.text }]}>
                                {course.credits || 0} credits
                            </Text>
                        </View>
                        <View style={[styles.badgeAccent, { backgroundColor: "#FEF3C7" }]}>
                            <Text style={styles.badgeAccentText}>
                                Target: {course.targetGrade || "—"}
                            </Text>
                        </View>
                        <Pressable
                            style={[styles.badge, styles.badgeIcon, { backgroundColor: theme.cardAlt }]}
                            onPress={() => setShowGradeDistribution(true)}
                        >
                            <Ionicons
                                name="pie-chart-outline"
                                size={14}
                                color={theme.text}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.summaryRow}>
                        <View>
                            {showCurrentGrade ? (
                                <>
                                    <Text style={[styles.gradeText, { color: theme.text }]}>
                                        {currentGrade}{" "}
                                        <Text style={[styles.gradePercent, { color: theme.muted }]}>
                                            ({metrics.currentPercent.toFixed(1)}%)
                                        </Text>
                                    </Text>
                                </>
                            ) : (
                                <Text style={[styles.summaryText, { color: theme.muted }]}>
                                    No grades yet
                                </Text>
                            )}
                        </View>
                        <Pressable onPress={handleCirclePress}>
                            <View
                                style={[
                                    styles.progressCircle,
                                    { borderColor: displayMode.color },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressText,
                                        { color: displayMode.textColor },
                                    ]}
                                >
                                    {formatPercent(displayMode.percent)}%
                                </Text>
                            </View>
                        </Pressable>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <Text style={[styles.instructor, { color: theme.muted }]}>
                        Instructor: {course.instructor || "—"}
                    </Text>
                </View>

                <Pressable
                    style={[styles.addAssessmentButton, { backgroundColor: theme.accent }]}
                    onPress={() => setShowAddAssessment(true)}
                >
                    <Ionicons name="add" size={20} color="#FFF" />
                    <Text style={styles.addAssessmentText}>Add Assessment</Text>
                </Pressable>

                {assessments.length === 0 && (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            No assessments yet
                        </Text>
                        <Text style={[styles.emptySub, { color: theme.muted }]}>
                            Add assignments, quizzes, and exams to track your progress
                        </Text>
                    </View>
                )}

                {assessments.map((assessment) => (
                    <View
                        key={assessment.id}
                        style={[styles.assessmentCard, { backgroundColor: theme.card }]}
                    >
                        <View style={styles.assessmentMain}>
                            <Text style={[styles.assessmentTitle, { color: theme.text }]}>
                                {assessment.typeIcon ? `${assessment.typeIcon} ` : ""}{assessment.name}
                            </Text>
                            <Text style={[styles.assessmentMeta, { color: theme.muted }]}>
                                {assessment.type} • {assessment.weight}%{" "}
                                {typeof assessment.score === "number"
                                    ? `• Score: ${assessment.score}%`
                                    : ""}
                            </Text>
                        </View>
                        <View style={styles.assessmentActions}>
                            <Pressable
                                style={[styles.iconButton, { backgroundColor: theme.cardAlt }]}
                                onPress={() => openEditScore(assessment)}
                            >
                                <Ionicons
                                    name="create-outline"
                                    size={18}
                                    color={theme.muted}
                                />
                            </Pressable>
                            <Pressable
                                style={[styles.iconButton, { backgroundColor: theme.cardAlt }]}
                                onPress={() =>
                                    onDeleteAssessment(
                                        semesterId,
                                        course.id,
                                        assessment.id
                                    )
                                }
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color={theme.danger}
                                />
                            </Pressable>
                            <Text style={[styles.assessmentStatus, { color: theme.muted }]}>
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
                    <Ionicons name="trash-outline" size={18} color={theme.danger} />
                    <Text style={[styles.deleteText, { color: theme.danger }]}>
                        Delete Course
                    </Text>
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
            <EditGradeDistributionSheet
                visible={showGradeDistribution}
                onClose={() => setShowGradeDistribution(false)}
                distributions={course.gradeDistributions || []}
                onSave={(items) =>
                    onUpdateCourse(semesterId, course.id, {
                        gradeDistributions: items,
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
    badgeIcon: {
        width: 90,
        justifyContent: "center",
        alignItems: "center",
    },

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
    assessmentMain: {
        flex: 1,
        marginRight: 10,
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
