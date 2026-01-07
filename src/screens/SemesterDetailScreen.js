import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SemesterDetailScreen({ semester, onBack }) {
    // const { term, year } = route.params;

    return (
        <SafeAreaView style={styles.safe}>
            {/* ---------- Header ---------- */}
            <View style={styles.header}>
                <Pressable onPress={onBack}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </Pressable>

                <View>
                    <Text style={styles.title}>
                        {semester.term} {semester.year}                    </Text>
                    <Text style={styles.subtitle}>0 courses • 0 credits</Text>
                </View>

                <Pressable>
                    <Ionicons name="trash-outline" size={22} color="#111827" />
                </Pressable>
            </View>

            {/* ---------- GPA Card ---------- */}
            <View style={styles.gpaCard}>
                <View style={styles.gpaCircle}>
                    <Text style={styles.gpaText}>0.00</Text>
                </View>
                <Text style={styles.gpaLabel}>Semester GPA</Text>
                <Text style={styles.creditText}>0 credits</Text>
            </View>

            {/* ---------- Add Course Button ---------- */}
            <Pressable style={styles.addCourseButton}>
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={styles.addCourseText}>Add Course</Text>
            </Pressable>

            {/* ---------- Empty State ---------- */}
            <View style={styles.empty}>
                <Text style={styles.book}>📖</Text>
                <Text style={styles.emptyTitle}>No courses yet</Text>
                <Text style={styles.emptySub}>
                    Add courses to start tracking your grades for this semester
                </Text>
            </View>
        </SafeAreaView>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F7F8FC", padding: 16 },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    title: { fontSize: 20, fontWeight: "700" },
    subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },

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
    gpaText: { fontSize: 32, fontWeight: "700" },
    gpaLabel: { marginTop: 12, fontSize: 14, color: "#6B7280" },
    creditText: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },

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
    addCourseText: { color: "#FFF", fontSize: 15, fontWeight: "600" },

    empty: { alignItems: "center", marginTop: 20 },
    book: { fontSize: 40, marginBottom: 12 },
    emptyTitle: { fontSize: 16, fontWeight: "600" },
    emptySub: {
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 6,
        maxWidth: 260,
    },
});
