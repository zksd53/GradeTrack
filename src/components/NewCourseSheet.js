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
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function NewCourseSheet({ visible, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [credits, setCredits] = useState(3);
    const [instructor, setInstructor] = useState("");
    const [targetGrade, setTargetGrade] = useState("A");
    const [notes, setNotes] = useState("");

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
                <View style={styles.sheet}>
                    <ScrollView
                        contentContainerStyle={styles.sheetContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.header}>
                            <Text style={styles.title}>New Course</Text>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close" size={22} />
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Course Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Introduction to Computer Science"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.label}>Course Code</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="CS101"
                            value={code}
                            onChangeText={setCode}
                        />

                        <Text style={styles.label}>Credit Hours *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="3"
                            keyboardType="numeric"
                            value={String(credits)}
                            onChangeText={(v) => setCredits(Number(v))}
                        />

                        <Text style={styles.label}>Instructor</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dr. Smith"
                            value={instructor}
                            onChangeText={setInstructor}
                        />

                        <Text style={styles.label}>Target Grade</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="A"
                            value={targetGrade}
                            onChangeText={setTargetGrade}
                        />

                        <Text style={styles.label}>Notes</Text>
                        <TextInput
                            style={[styles.input, styles.notes]}
                            placeholder="Any additional notes..."
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                        />

                        <Pressable style={styles.createBtn} onPress={handleCreate}>
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
        backgroundColor: "#FFF",
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
        borderColor: "#E5E7EB",
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
