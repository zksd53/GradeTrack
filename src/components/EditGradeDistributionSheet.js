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

const gradeOptions = ["A+", "A", "B+", "B", "C+", "C"];

export default function EditGradeDistributionSheet({
    visible,
    onClose,
    distributions = [],
    onSave,
}) {
    const { theme } = useContext(ThemeContext);
    const [selectedGrade, setSelectedGrade] = useState("A");
    const [value, setValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [items, setItems] = useState(distributions);

    const inputTheme = useMemo(
        () => ({
            backgroundColor: theme.cardAlt,
            borderColor: theme.border,
            color: theme.text,
            placeholderTextColor: theme.muted,
        }),
        [theme]
    );

    const handleAdd = () => {
        if (!value) return;
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.grade === selectedGrade
            );
            if (existingIndex >= 0) {
                const next = [...prev];
                next[existingIndex] = { grade: selectedGrade, value };
                return next;
            }
            return [...prev, { grade: selectedGrade, value }];
        });
        setValue("");
    };

    const handleRemove = (index) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        onSave(items);
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
                                Grade Distribution
                            </Text>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close" size={22} color={theme.text} />
                            </Pressable>
                        </View>

                        <Text style={[styles.label, { color: theme.muted }]}>
                            Add Grade
                        </Text>
                        <View style={styles.row}>
                            <Pressable
                                style={[styles.select, inputTheme]}
                                onPress={() => setShowDropdown(!showDropdown)}
                            >
                                <Text style={[styles.selectText, { color: theme.text }]}>
                                    {selectedGrade}
                                </Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={18}
                                    color={theme.muted}
                                />
                            </Pressable>
                            <TextInput
                                style={[styles.input, inputTheme]}
                                placeholder="Value"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={setValue}
                                placeholderTextColor={inputTheme.placeholderTextColor}
                            />
                        </View>
                        {showDropdown && (
                            <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                                {gradeOptions.map((grade) => (
                                    <Pressable
                                        key={grade}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setSelectedGrade(grade);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <Text
                                            style={[styles.dropdownText, { color: theme.text }]}
                                        >
                                            {grade}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                        <Pressable
                            style={[styles.addBtn, { backgroundColor: theme.cardAlt }]}
                            onPress={handleAdd}
                        >
                            <Text style={[styles.addText, { color: theme.text }]}>
                                Add Grade
                            </Text>
                        </Pressable>

                        {items.length > 0 && (
                            <View style={styles.list}>
                                {items.map((item, index) => (
                                    <View
                                        key={`${item.grade}-${index}`}
                                        style={[
                                            styles.listItem,
                                            { backgroundColor: theme.cardAlt },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.listText,
                                                { color: theme.text },
                                            ]}
                                        >
                                            {item.grade}: {item.value}
                                        </Text>
                                        <Pressable onPress={() => handleRemove(index)}>
                                            <Ionicons
                                                name="close"
                                                size={16}
                                                color={theme.muted}
                                            />
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        )}

                        <Pressable
                            style={[styles.saveBtn, { backgroundColor: theme.accent }]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveText}>Save Distribution</Text>
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
    title: { fontSize: 18, fontWeight: "600" },
    label: { fontSize: 13, fontWeight: "500", marginTop: 6 },
    row: {
        flexDirection: "row",
        gap: 10,
        marginTop: 6,
    },
    select: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectText: { fontSize: 14, fontWeight: "500" },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
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
    addBtn: {
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    addText: { fontSize: 13, fontWeight: "600" },
    list: {
        marginTop: 12,
        gap: 8,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    listText: { fontSize: 12, fontWeight: "600" },
    saveBtn: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },
    saveText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});
