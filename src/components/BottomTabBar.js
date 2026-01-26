import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { ThemeContext } from "../theme";

export default function BottomTabBar({ activeTab, setActiveTab, height }) {
    const { theme } = useContext(ThemeContext);
    return (
        <SafeAreaView
            style={[
                styles.safe,
                { height, backgroundColor: theme.navBg, borderTopColor: theme.navBorder },
            ]}
        >
            <View style={styles.container}>
                <Tab
                    label="Home"
                    icon="home"
                    active={activeTab === "home"}
                    onPress={() => setActiveTab("home")}
                    theme={theme}
                />

                <Tab
                    label="Semesters"
                    icon="book"
                    active={activeTab === "semesters"}
                    onPress={() => setActiveTab("semesters")}
                    theme={theme}
                />

                <Tab
                    label="Analytics"
                    icon="stats-chart"
                    active={activeTab === "analytics"}
                    onPress={() => setActiveTab("analytics")}
                    theme={theme}
                />

                <Tab
                    label="Settings"
                    icon="settings"
                    active={activeTab === "settings"}
                    onPress={() => setActiveTab("settings")}
                    theme={theme}
                />
            </View>



        </SafeAreaView>
    );
}

function Tab({ label, active, onPress, icon, theme }) {
    return (
        <Pressable onPress={onPress} style={styles.tab}>
            {icon && (
                <Ionicons
                    name={active ? icon : `${icon}-outline`}
                    size={22}
                    color={active ? theme.navActive : theme.navText}
                    style={{ marginBottom: 8 }}
                />
            )}

            <Text
                style={[
                    styles.text,
                    { color: theme.navText },
                    active && styles.active,
                    active && { color: theme.text },
                ]}
            >
                {label}
            </Text>

            {active && <View style={[styles.dot, { backgroundColor: theme.navActive }]} />}
        </Pressable>
    );
}



const styles = StyleSheet.create({
    safe: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
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
        paddingTop : 5.5,
    },
    text: {
        fontSize: 13,
        fontWeight: "500",
        marginBottom : 1,
    },
    active: {
        fontWeight: "600",
    },
    dot: {
        marginTop: 3,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
