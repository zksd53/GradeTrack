import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useContext, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../theme";

export default function NewCourseSheet({ visible, onClose, onCreate }) {
    const { theme } = useContext(ThemeContext);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [credits, setCredits] = useState("");
    const [instructor, setInstructor] = useState("");
    const [targetGrade, setTargetGrade] = useState("");
    const [notes, setNotes] = useState("");
    const [gradeDistGrade, setGradeDistGrade] = useState("A");
    const [gradeDistValue, setGradeDistValue] = useState("");
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);
    const [touched, setTouched] = useState({
        name: false,
        code: false,
        credits: false,
        instructor: false,
        targetGrade: false,
        notes: false,
    });

    const inputTheme = useMemo(
        () => ({
            backgroundColor: theme.cardAlt,
            borderColor: theme.border,
            color: theme.text,
            placeholderTextColor: theme.muted,
        }),
        [theme]
    );
    const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-"];

    const handleCreate = () => {
        const trimmedName = name.trim();
        const trimmedCode = code.trim();
        const safeCredits = Number.isFinite(Number(credits))
            ? Number(credits)
            : 0;
        if (!trimmedName) return;

        onCreate({
            id: Date.now().toString(),
            name: trimmedName,
            code: trimmedCode,
            credits: safeCredits,
            instructor,
            targetGrade,
            gradeDistribution: {
                grade: gradeDistGrade,
                value: gradeDistValue,
            },
            notes,
            grade: null,
            assessments: [],
        });

        // reset
        setName("");
        setCode("");
        setCredits("");
        setInstructor("");
        setTargetGrade("");
        setNotes("");
        setGradeDistGrade("A");
        setGradeDistValue("");
        setShowGradeDropdown(false);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={[styles.sheet, { backgroundColor: theme.card }]}>
                    <ScrollView
                        contentContainerStyle={styles.sheetContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: theme.text }]}>
                                New Course
                            </Text>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close" size={22} color={theme.text} />
                            </Pressable>
                        </View>

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Course Name *
                        </Text>
                        <TextInput
                            style={[styles.input, inputTheme]}
                            placeholder="Introduction to Computer Science"
                            value={name}
                            onChangeText={setName}
                            onFocus={() => {
                                if (!touched.name) setName("");
                                setTouched((prev) => ({ ...prev, name: true }));
                            }}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Course Code
                        </Text>
                        <TextInput
                            style={[styles.input, inputTheme]}
                            placeholder="CS101"
                            value={code}
                            onChangeText={setCode}
                            onFocus={() => {
                                if (!touched.code) setCode("");
                                setTouched((prev) => ({ ...prev, code: true }));
                            }}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Credit Hours *
                        </Text>
                        <TextInput
                            style={[styles.input, inputTheme]}
                            placeholder="3"
                            keyboardType="numeric"
                            value={credits}
                            onChangeText={setCredits}
                            onFocus={() => {
                                if (!touched.credits) setCredits("");
                                setTouched((prev) => ({ ...prev, credits: true }));
                            }}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Instructor
                        </Text>
                        <TextInput
                            style={[styles.input, inputTheme]}
                            placeholder="Dr. Smith"
                            value={instructor}
                            onChangeText={setInstructor}
                            onFocus={() => {
                                if (!touched.instructor) setInstructor("");
                                setTouched((prev) => ({ ...prev, instructor: true }));
                            }}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Target Grade
                        </Text>
                        <TextInput
                            style={[styles.input, inputTheme]}
                            placeholder="A"
                            value={targetGrade}
                            onChangeText={setTargetGrade}
                            onFocus={() => {
                                if (!touched.targetGrade) setTargetGrade("");
                                setTouched((prev) => ({ ...prev, targetGrade: true }));
                            }}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Grade Distribution
                        </Text>
                        <View style={styles.gradeRow}>
                            <Pressable
                                style={[styles.select, styles.gradeSelect, inputTheme]}
                                onPress={() => setShowGradeDropdown(!showGradeDropdown)}
                            >
                                <Text style={[styles.selectText, { color: theme.text }]}>
                                    {gradeDistGrade}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color={theme.muted} />
                            </Pressable>
                            <TextInput
                                style={[styles.input, styles.gradeInput, inputTheme]}
                                placeholder="Value"
                                keyboardType="numeric"
                                value={gradeDistValue}
                                onChangeText={setGradeDistValue}
                                placeholderTextColor={inputTheme.placeholderTextColor}
                            />
                        </View>
                        {showGradeDropdown && (
                            <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                                {gradeOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setGradeDistGrade(item);
                                            setShowGradeDropdown(false);
                                        }}
                                    >
                                        <Text style={[styles.dropdownText, { color: theme.text }]}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Notes
                        </Text>
                        <TextInput
                            style={[styles.input, styles.notes, inputTheme]}
                            placeholder="Any additional notes..."
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                            onFocus={() => {
                                if (!touched.notes) setNotes("");
                                setTouched((prev) => ({ ...prev, notes: true }));
                            }}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />

                        <Pressable
                            style={[styles.createBtn, { backgroundColor: theme.accent }]}
                            onPress={handleCreate}
                        >
                            <Text style={styles.createText}>Create Course</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    sheetContent: {
        paddingBottom: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    title: { fontSize: 18, fontWeight: "700" },
    label: { fontSize: 13, fontWeight: "600", marginTop: 10 },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
    },
    select: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectText: { fontSize: 14, fontWeight: "500" },
    dropdown: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        marginTop: 6,
        overflow: "hidden",
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    dropdownText: { fontSize: 14, fontWeight: "500" },
    gradeRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 4,
    },
    gradeSelect: {
        flex: 1,
        marginTop: 0,
    },
    gradeInput: {
        flex: 1,
        marginTop: 0,
    },
    notes: { height: 80 },
    createBtn: {
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
    },
    createText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});
