import { View, Text, StyleSheet } from "react-native";

export default function StatCard({ value, label }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#1C2436",
    borderRadius: 14,
    padding: 20,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
  label: {
    color: "#9AA3B2",
    marginTop: 6,
    fontSize: 13,
  },
});
