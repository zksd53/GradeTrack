import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomTabBar({ activeTab, setActiveTab, height }) {
    return (
        <SafeAreaView style={[styles.safe, { height }]}>
            <View style={styles.container}>
                <Tab
                    label="Home"
                    icon="home"
                    active={activeTab === "home"}
                    onPress={() => setActiveTab("home")}
                />

                <Tab
                    label="Semesters"
                    icon="book"
                    active={activeTab === "semesters"}
                    onPress={() => setActiveTab("semesters")}
                />

                <Tab
                    label="Settings"
                    icon="settings"
                    active={activeTab === "settings"}
                    onPress={() => setActiveTab("settings")}
                />
            </View>



        </SafeAreaView>
    );
}

function Tab({ label, active, onPress, icon }) {
    return (
        <Pressable onPress={onPress} style={styles.tab}>
            {icon && (
                <Ionicons
                    name={active ? icon : `${icon}-outline`}
                    size={22}
                    color={active ? "#6C7CFF" : "#9AA3B2"}
                    style={{ marginBottom: 4 }}
                />
            )}

            <Text style={[styles.text, active && styles.active]}>
                {label}
            </Text>

            {active && <View style={styles.dot} />}
        </Pressable>
    );
}



const styles = StyleSheet.create({
    safe: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0B1020",
        borderTopWidth: 1,
        borderTopColor: "#1C2436",
    },
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#9AA3B2",
        fontSize: 13,
        fontWeight: "500",
    },
    active: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    dot: {
        marginTop: 6,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#6C7CFF",
    },
});
