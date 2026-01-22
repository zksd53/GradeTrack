import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList } from "react-native";


export default function NewSemesterSheet({
    visible,
    onClose,
    onCreate,
}) {
    // TERM
    const [term, setTerm] = useState("Fall");
    const [showTermDropdown, setShowTermDropdown] = useState(false);

    // YEAR
    const [year, setYear] = useState(2026);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    // STATUS
    const [status, setStatus] = useState("Planned");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // CURRENT SEMESTER
    const [isCurrent, setIsCurrent] = useState(false);

    const years = Array.from({ length: 21 }, (_, i) => 2020 + i);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>New Semester</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={22} color="#9AA3B2" />
                        </Pressable>
                    </View>

                    {/* 🔥 MAIN SCROLL */}

                    {/* TERM */}
                    <Text style={styles.label}>Term</Text>
                    <Pressable
                        style={styles.input}
                        onPress={() => {
                            setShowTermDropdown(!showTermDropdown);
                            setShowYearDropdown(false);
                            setShowStatusDropdown(false);
                        }}
                    >
                        <Text style={styles.value}>{term}</Text>
                        <Ionicons name="chevron-down" size={18} color="#9AA3B2" />
                    </Pressable>

                    {showTermDropdown && (
                        <View style={styles.dropdown}>
                            {["Winter", "Summer", "Spring", "Fall"].map(item => (
                                <Pressable
                                    key={item}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setTerm(item);
                                        setShowTermDropdown(false);
                                    }}
                                >
                                    <Text style={styles.dropdownText}>{item}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {/* YEAR */}
                    <Text style={styles.label}>Year</Text>
                    <Pressable
                        style={styles.input}
                        onPress={() => {
                            setShowYearDropdown(!showYearDropdown);
                            setShowTermDropdown(false);
                            setShowStatusDropdown(false);
                        }}
                    >
                        <Text style={styles.value}>{year}</Text>
                        <Ionicons name="chevron-down" size={18} color="#9AA3B2" />
                    </Pressable>

                    {showYearDropdown && (
                        <View style={[styles.dropdown, { maxHeight: 180 }]}>
                            <FlatList
                                data={years}
                                keyExtractor={(item) => item.toString()}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setYear(item);
                                            setShowYearDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </Pressable>
                                )}
                            />
                        </View>

                    )}

                    {/* STATUS */}
                    <Text style={styles.label}>Status</Text>
                    <Pressable
                        style={styles.input}
                        onPress={() => {
                            setShowStatusDropdown(!showStatusDropdown);
                            setShowTermDropdown(false);
                            setShowYearDropdown(false);
                        }}
                    >
                        <Text style={styles.value}>{status}</Text>
                        <Ionicons name="chevron-down" size={18} color="#9AA3B2" />
                    </Pressable>

                    {showStatusDropdown && (
                        <View style={styles.dropdown}>
                            {["Planned", "In Progress", "Completed"].map(item => (
                                <Pressable
                                    key={item}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setStatus(item);
                                        setShowStatusDropdown(false);
                                    }}
                                >
                                    <Text style={styles.dropdownText}>{item}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {/* CURRENT SEMESTER */}
                    <Pressable
                        style={styles.currentRow}
                        onPress={() => setIsCurrent(!isCurrent)}
                    >
                        <View>
                            <Text style={styles.currentTitle}>Current Semester</Text>
                            <Text style={styles.currentSub}>
                                Set as your active semester
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.toggle,
                                isCurrent && styles.toggleActive,
                            ]}
                        >
                            <View
                                style={[
                                    styles.toggleKnob,
                                    isCurrent && styles.toggleKnobActive,
                                ]}
                            />
                        </View>
                    </Pressable>

                    {/* CREATE */}
                    <Pressable
                        style={styles.createBtn}
                        onPress={() => {
                            onCreate({
                                id: `${term}-${year}`,
                                term,
                                year,
                                status,
                                gpa: "0.00",
                                courses: [],
                                credits: 0,
                                current: isCurrent,
                            });
                            onClose();
                        }}
                    >
                        <Text style={styles.createText}>Create Semester</Text>
                    </Pressable>

                </View>
            </View>
        </Modal>
    );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end",
    },

    sheet: {
        backgroundColor: "#0B1220",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 32,
        maxHeight: "90%",
    },

    handle: {
        width: 40,
        height: 4,
        backgroundColor: "#374151",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 16,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFF",
    },

    label: {
        color: "#9AA3B2",
        fontSize: 13,
        marginBottom: 6,
        marginTop: 14,
    },

    input: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 14,
        padding: 14,
    },

    value: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500",
    },

    dropdown: {
        backgroundColor: "#0F172A",
        borderRadius: 14,
        marginTop: 6,
        overflow: "hidden",
    },

    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#1F2937",
    },

    dropdownText: {
        color: "#FFF",
        fontSize: 15,
    },

    currentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#111827",
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
    },

    currentTitle: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "600",
    },

    currentSub: {
        color: "#9AA3B2",
        fontSize: 12,
        marginTop: 2,
    },

    toggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#374151",
        justifyContent: "center",
        padding: 2,
    },

    toggleActive: {
        backgroundColor: "#22C55E",
    },

    toggleKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FFF",
        alignSelf: "flex-start",
    },

    toggleKnobActive: {
        alignSelf: "flex-end",
    },

    createBtn: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 24,
    },

    createText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },


});
