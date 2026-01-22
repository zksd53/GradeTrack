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
    Switch,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function NewAssessmentSheet({ visible, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("Assignment");
    const [weight, setWeight] = useState("10");
    const [dueMonth, setDueMonth] = useState("Jan");
    const [dueDay, setDueDay] = useState("1");
    const [completed, setCompleted] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showDayDropdown, setShowDayDropdown] = useState(false);

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

    const monthOptions = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));
    const weightValue = Number(weight);
    const showWeightWarning =
        Number.isFinite(weightValue) && weightValue > 100;

    const handleCreate = () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        onCreate({
            id: Date.now().toString(),
            name: trimmedName,
            type: type.trim() || "Assignment",
            weight: Number(weight) || 0,
            dueDate: `${dueMonth} ${dueDay}`,
            completed,
            score: null,
        });

        setName("");
        setType("Assignment");
        setWeight("10");
        setDueMonth("Jan");
        setDueDay("1");
        setCompleted(false);
        setShowTypeDropdown(false);
        setShowMonthDropdown(false);
        setShowDayDropdown(false);
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
                            <Text style={styles.title}>New Assessment</Text>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close" size={22} />
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Midterm Exam 1"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.label}>Type</Text>
                        <Pressable
                            style={styles.select}
                            onPress={() => {
                                setShowTypeDropdown(!showTypeDropdown);
                                setShowMonthDropdown(false);
                                setShowDayDropdown(false);
                            }}
                        >
                            <Text style={styles.selectText}>{type}</Text>
                            <Ionicons name="chevron-down" size={18} color="#6B7280" />
                        </Pressable>
                        {showTypeDropdown && (
                            <View style={styles.dropdown}>
                                {typeOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setType(item);
                                            setShowTypeDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        <Text style={styles.label}>Weight (%)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="10"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                        />
                        {showWeightWarning && (
                            <View style={styles.warning}>
                                <Ionicons
                                    name="alert-circle"
                                    size={16}
                                    color="#B45309"
                                />
                                <Text style={styles.warningText}>
                                    Quiz percentages should be 100 or less.
                                </Text>
                            </View>
                        )}

                        <Text style={styles.label}>Due Date</Text>
                        <View style={styles.dateRow}>
                            <Pressable
                                style={[styles.select, styles.dateSelect]}
                                onPress={() => {
                                    setShowMonthDropdown(!showMonthDropdown);
                                    setShowDayDropdown(false);
                                    setShowTypeDropdown(false);
                                }}
                            >
                                <Text style={styles.selectText}>{dueMonth}</Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={18}
                                    color="#6B7280"
                                />
                            </Pressable>
                            <Pressable
                                style={[styles.select, styles.dateSelect]}
                                onPress={() => {
                                    setShowDayDropdown(!showDayDropdown);
                                    setShowMonthDropdown(false);
                                    setShowTypeDropdown(false);
                                }}
                            >
                                <Text style={styles.selectText}>{dueDay}</Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={18}
                                    color="#6B7280"
                                />
                            </Pressable>
                        </View>
                        {showMonthDropdown && (
                            <View style={styles.dropdown}>
                                {monthOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setDueMonth(item);
                                            setShowMonthDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                        {showDayDropdown && (
                            <View style={styles.dropdown}>
                                {dayOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setDueDay(item);
                                            setShowDayDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        <View style={styles.switchRow}>
                            <View>
                                <Text style={styles.switchTitle}>Completed</Text>
                                <Text style={styles.switchSub}>Mark as graded</Text>
                            </View>
                            <Switch
                                value={completed}
                                onValueChange={setCompleted}
                            />
                        </View>

                        <Pressable style={styles.createBtn} onPress={handleCreate}>
                            <Text style={styles.createText}>
                                Create Assessment
                            </Text>
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
    },
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
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    dropdownText: { fontSize: 14, color: "#111827" },
    dateRow: {
        flexDirection: "row",
        gap: 10,
    },
    dateSelect: {
        flex: 1,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        padding: 14,
        borderRadius: 12,
        marginTop: 14,
    },
    switchTitle: { fontSize: 14, fontWeight: "600" },
    switchSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
    createBtn: {
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
    },
    createText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
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
});
