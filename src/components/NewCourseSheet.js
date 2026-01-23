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
    const [credits, setCredits] = useState(3);
    const [instructor, setInstructor] = useState("");
    const [targetGrade, setTargetGrade] = useState("A");
    const [notes, setNotes] = useState("");
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
            notes,
            grade: null,
            assessments: [],
        });

        // reset
        setName("");
        setCode("");
        setCredits(3);
        setInstructor("");
        setTargetGrade("A");
        setNotes("");
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
                            value={String(credits)}
                            onChangeText={(v) => setCredits(Number(v))}
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
