import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
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
    const { theme } = useContext(ThemeContext);

    // ALWAYS derive from props (single source of truth)
    const courses = Array.isArray(semester.courses)
        ? semester.courses
        : [];


    const totalCredits = courses.reduce(
        (sum, c) => sum + (Number(c?.credits) || 0),
        0
    );


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
                        <Text style={[styles.gpaText, { color: theme.text }]}>0.00</Text>
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
                            <View style={[styles.progressCircle, { borderColor: theme.border }]}>
                                <Text style={[styles.progressText, { color: theme.text }]}>
                                    0%
                                </Text>
                            </View>
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
