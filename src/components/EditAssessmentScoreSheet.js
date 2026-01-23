import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useContext, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../theme";

export default function EditAssessmentScoreSheet({
    visible,
    assessment,
    onClose,
    onSave,
}) {
    const { theme } = useContext(ThemeContext);
    const [score, setScore] = useState("");
    const inputTheme = useMemo(
        () => ({
            backgroundColor: theme.cardAlt,
            borderColor: theme.border,
            color: theme.text,
            placeholderTextColor: theme.muted,
        }),
        [theme]
    );

    useEffect(() => {
        if (assessment) {
            const starting =
                typeof assessment.score === "number" ? String(assessment.score) : "";
            setScore(starting);
        }
    }, [assessment]);

    const scoreValue = Number(score);
    const scoreInvalid = score !== "" && (!Number.isFinite(scoreValue) || scoreValue < 0);
    const scoreTooHigh = Number.isFinite(scoreValue) && scoreValue > 100;

    const handleSave = () => {
        if (scoreInvalid || scoreTooHigh) return;
        const nextScore =
            score === "" || !Number.isFinite(scoreValue) ? null : scoreValue;
        onSave(nextScore);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={[styles.sheet, { backgroundColor: theme.card }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>
                            Edit Score
                        </Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={22} color={theme.text} />
                        </Pressable>
                    </View>

                    <Text style={[styles.label, { color: theme.muted }]}>
                        Assessment
                    </Text>
                    <Text style={[styles.value, { color: theme.text }]}>
                        {assessment?.name || "Assessment"}
                    </Text>

                    <Text style={[styles.label, { color: theme.muted }]}>
                        Score (%)
                    </Text>
                    <TextInput
                        style={[styles.input, inputTheme]}
                        placeholder="e.g. 85"
                        keyboardType="numeric"
                        value={score}
                        onChangeText={setScore}
                        placeholderTextColor={inputTheme.placeholderTextColor}
                    />

                    {scoreTooHigh && (
                        <View style={[styles.warning, { backgroundColor: theme.cardAlt }]}>
                            <Ionicons
                                name="alert-circle"
                                size={16}
                                color="#B45309"
                            />
                            <Text style={styles.warningText}>
                                Scores should be 100 or less.
                            </Text>
                        </View>
                    )}

                    <Pressable
                        style={[
                            styles.saveBtn,
                            { backgroundColor: theme.accent },
                            (scoreInvalid || scoreTooHigh) && styles.saveBtnDisabled,
                        ]}
                        onPress={handleSave}
                        disabled={scoreInvalid || scoreTooHigh}
                    >
                        <Text style={styles.saveText}>Save Score</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    title: { fontSize: 18, fontWeight: "700" },
    label: { fontSize: 13, fontWeight: "600", marginTop: 10 },
    value: { fontSize: 14, marginTop: 6 },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
    },
    warning: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FEF3C7",
        borderRadius: 10,
        padding: 10,
        marginTop: 8,
    },
    warningText: { fontSize: 12, color: "#92400E", fontWeight: "600" },
    saveBtn: {
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
    },
    saveBtnDisabled: {
        opacity: 0.5,
    },
    saveText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});
