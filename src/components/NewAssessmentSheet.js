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
import { useContext, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../theme";

export default function NewAssessmentSheet({ visible, onClose, onCreate }) {
    const { theme } = useContext(ThemeContext);
    const [name, setName] = useState("");
    const [type, setType] = useState("Assignment");
    const [weight, setWeight] = useState("10");
    const [dueMonth, setDueMonth] = useState("Jan");
    const [dueDay, setDueDay] = useState("1");
    const [dueYear, setDueYear] = useState("2024");
    const [completed, setCompleted] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showDayDropdown, setShowDayDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

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
    const yearOptions = Array.from({ length: 21 }, (_, i) =>
        String(2018 + i)
    );
    const weightValue = Number(weight);
    const showWeightWarning =
        Number.isFinite(weightValue) && weightValue > 100;
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
        if (!trimmedName) return;

        onCreate({
            id: Date.now().toString(),
            name: trimmedName,
            type: type.trim() || "Assignment",
            weight: Number(weight) || 0,
            dueDate: `${dueMonth} ${dueDay}, ${dueYear}`,
            completed,
            score: null,
        });

        setName("");
        setType("Assignment");
        setWeight("10");
        setDueMonth("Jan");
        setDueDay("1");
        setDueYear("2024");
        setCompleted(false);
        setShowTypeDropdown(false);
        setShowMonthDropdown(false);
        setShowDayDropdown(false);
        setShowYearDropdown(false);
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
                            <Text style={[styles.title, { color: theme.text }]}>
                                New Assessment
                            </Text>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close" size={22} color={theme.text} />
                            </Pressable>
                        </View>

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Name *
                        </Text>
                        <TextInput
                            style={[styles.input, inputTheme]}
                            placeholder="Midterm Exam 1"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Type
                        </Text>
                        <Pressable
                            style={[styles.select, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
                            onPress={() => {
                                setShowTypeDropdown(!showTypeDropdown);
                                setShowMonthDropdown(false);
                                setShowDayDropdown(false);
                                setShowYearDropdown(false);
                            }}
                        >
                            <Text style={[styles.selectText, { color: theme.text }]}>
                                {type}
                            </Text>
                            <Ionicons name="chevron-down" size={18} color={theme.muted} />
                        </Pressable>
                        {showTypeDropdown && (
                            <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                                {typeOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setType(item);
                                            setShowTypeDropdown(false);
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
                            Weight (%)
                        </Text>
                        <TextInput
                            style={[styles.input, inputTheme]}
                            placeholder="10"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor={inputTheme.placeholderTextColor}
                        />
                        {showWeightWarning && (
                            <View style={[styles.warning, { backgroundColor: theme.cardAlt }]}>
                                <Ionicons
                                    name="alert-circle"
                                    size={16}
                                    color="#B45309"
                                />
                                <Text style={[styles.warningText, { color: "#B45309" }]}>
                                    Quiz percentages should be 100 or less.
                                </Text>
                            </View>
                        )}

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Due Date
                        </Text>
                        <View style={styles.dateRow}>
                            <Pressable
                                style={[
                                    styles.select,
                                    styles.dateSelect,
                                    { backgroundColor: theme.cardAlt, borderColor: theme.border },
                                ]}
                                onPress={() => {
                                    setShowMonthDropdown(!showMonthDropdown);
                                    setShowDayDropdown(false);
                                    setShowTypeDropdown(false);
                                    setShowYearDropdown(false);
                                }}
                            >
                                <Text style={[styles.selectText, { color: theme.text }]}>
                                    {dueMonth}
                                </Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={18}
                                    color={theme.muted}
                                />
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.select,
                                    styles.dateSelect,
                                    { backgroundColor: theme.cardAlt, borderColor: theme.border },
                                ]}
                                onPress={() => {
                                    setShowDayDropdown(!showDayDropdown);
                                    setShowMonthDropdown(false);
                                    setShowTypeDropdown(false);
                                    setShowYearDropdown(false);
                                }}
                            >
                                <Text style={[styles.selectText, { color: theme.text }]}>
                                    {dueDay}
                                </Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={18}
                                    color={theme.muted}
                                />
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.select,
                                    styles.dateSelect,
                                    { backgroundColor: theme.cardAlt, borderColor: theme.border },
                                ]}
                                onPress={() => {
                                    setShowYearDropdown(!showYearDropdown);
                                    setShowMonthDropdown(false);
                                    setShowDayDropdown(false);
                                    setShowTypeDropdown(false);
                                }}
                            >
                                <Text style={[styles.selectText, { color: theme.text }]}>
                                    {dueYear}
                                </Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={18}
                                    color={theme.muted}
                                />
                            </Pressable>
                        </View>
                        {showMonthDropdown && (
                            <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                                {monthOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setDueMonth(item);
                                            setShowMonthDropdown(false);
                                        }}
                                    >
                                        <Text style={[styles.dropdownText, { color: theme.text }]}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                        {showDayDropdown && (
                            <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                                {dayOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setDueDay(item);
                                            setShowDayDropdown(false);
                                        }}
                                    >
                                        <Text style={[styles.dropdownText, { color: theme.text }]}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                        {showYearDropdown && (
                            <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                                <ScrollView style={styles.dropdownScroll}>
                                    {yearOptions.map((item) => (
                                        <Pressable
                                            key={item}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setDueYear(item);
                                                setShowYearDropdown(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownText,
                                                    { color: theme.text },
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <View style={[styles.switchRow, { backgroundColor: theme.cardAlt }]}>
                            <View>
                                <Text style={[styles.switchTitle, { color: theme.text }]}>
                                    Completed
                                </Text>
                                <Text style={[styles.switchSub, { color: theme.muted }]}>
                                    Mark as graded
                                </Text>
                            </View>
                            <Switch
                                value={completed}
                                onValueChange={setCompleted}
                                trackColor={{ false: theme.border, true: theme.accent }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <Pressable
                            style={[styles.createBtn, { backgroundColor: theme.accent }]}
                            onPress={handleCreate}
                        >
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
    dropdownScroll: { maxHeight: 200 },
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
