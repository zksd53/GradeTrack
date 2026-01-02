import { View, Text, StyleSheet, Pressable } from "react-native";

export default function CourseCard({ title, code, grade, onPress }) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.code}>{code}</Text>
            </View>

            <Text style={styles.grade}>{grade}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1C2436",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    code: {
        color: "#9AA3B2",
        fontSize: 13,
        marginTop: 4,
    },
    grade: {
        color: "#2ECC71",
        fontSize: 14,
        fontWeight: "600",
    },
});
