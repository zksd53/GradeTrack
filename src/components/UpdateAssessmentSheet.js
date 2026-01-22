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
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const typeOptions = [
    "Assignment",
    "Quiz",
    "Midterm",
    "Final Exam",
    "Lab",
    "Project",
    "Participation",
    "Other",
];

export default function UpdateAssessmentSheet({
    visible,
    onClose,
    courses = [],
    onSave,
}) {
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedType, setSelectedType] = useState(typeOptions[0]);
    const [score, setScore] = useState("");
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    useEffect(() => {
        if (visible) {
            const firstCourse = courses[0];
            setSelectedCourseId(firstCourse?.id || "");
            setSelectedType(typeOptions[0]);
            setScore("");
            setShowCourseDropdown(false);
            setShowTypeDropdown(false);
        }
    }, [visible, courses]);

    const selectedCourse = useMemo(
        () => courses.find((course) => course.id === selectedCourseId),
        [courses, selectedCourseId]
    );

    const scoreValue = Number(score);
    const scoreInvalid = score !== "" && (!Number.isFinite(scoreValue) || scoreValue < 0);
    const scoreTooHigh = Number.isFinite(scoreValue) && scoreValue > 100;

    const matchingAssessment = useMemo(() => {
        const assessments = Array.isArray(selectedCourse?.assessments)
            ? selectedCourse.assessments
            : [];
        const normalizedType = selectedType.trim().toLowerCase();
        return assessments.find(
            (assessment) =>
                String(assessment.type || "")
                    .trim()
                    .toLowerCase() === normalizedType
        );
    }, [selectedCourse, selectedType]);

    const canSave =
        !!selectedCourseId &&
        !!matchingAssessment &&
        score !== "" &&
        !scoreInvalid &&
        !scoreTooHigh;

    const handleSave = () => {
        if (!canSave) return;
        onSave(selectedCourseId, matchingAssessment.id, Number(score));
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
                            <Text style={styles.title}>Update Assessment</Text>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close" size={22} />
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Course</Text>
                        <Pressable
                            style={styles.select}
                            onPress={() => {
                                setShowCourseDropdown(!showCourseDropdown);
                                setShowTypeDropdown(false);
                            }}
                        >
                            <Text style={styles.selectText}>
                                {selectedCourse?.name || "Select course"}
                            </Text>
                            <Ionicons name="chevron-down" size={18} color="#6B7280" />
                        </Pressable>
                        {showCourseDropdown && (
                            <View style={styles.dropdown}>
                                <ScrollView style={styles.dropdownScroll}>
                                    {courses.map((course) => (
                                        <Pressable
                                            key={course.id}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setSelectedCourseId(course.id);
                                                setShowCourseDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>
                                                {course.name}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <Text style={styles.label}>Type of Assignment</Text>
                        <Pressable
                            style={styles.select}
                            onPress={() => {
                                setShowTypeDropdown(!showTypeDropdown);
                                setShowCourseDropdown(false);
                            }}
                        >
                            <Text style={styles.selectText}>{selectedType}</Text>
                            <Ionicons name="chevron-down" size={18} color="#6B7280" />
                        </Pressable>
                        {showTypeDropdown && (
                            <View style={styles.dropdown}>
                                <ScrollView style={styles.dropdownScroll}>
                                    {typeOptions.map((item) => (
                                        <Pressable
                                            key={item}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setSelectedType(item);
                                                setShowTypeDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>{item}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {!matchingAssessment && selectedCourseId ? (
                            <View style={styles.warning}>
                                <Ionicons
                                    name="alert-circle"
                                    size={16}
                                    color="#B45309"
                                />
                                <Text style={styles.warningText}>
                                    No assessment of this type found for this course.
                                </Text>
                            </View>
                        ) : null}

                        <Text style={styles.label}>Percentage Got</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 85"
                            keyboardType="numeric"
                            value={score}
                            onChangeText={setScore}
                        />

                        {scoreTooHigh && (
                            <View style={styles.warning}>
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
                            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={!canSave}
                        >
                            <Text style={styles.saveText}>Update Assessment</Text>
                        </Pressable>
                    </ScrollView>
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
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        padding: 20,
        maxHeight: "90%",
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
    select: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
    },
    selectText: { fontSize: 14, color: "#111827" },
    dropdown: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        marginTop: 6,
        overflow: "hidden",
        backgroundColor: "#FFF",
    },
    dropdownScroll: { maxHeight: 200 },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    dropdownText: { fontSize: 14, color: "#111827" },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
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
