import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../theme";

export default function AnalyticsScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
});
