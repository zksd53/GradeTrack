import { View, Text, StyleSheet } from "react-native";

export default function SemestersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Semesters</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
});
