import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Text style={styles.brandText}>GradeTrack</Text>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons
            name="pencil-ruler"
            size={14}
            color="#FFFFFF"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#585C6E",
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  brandText: {
    color: "#F4B35E",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  iconBadge: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: "#4A4E60",
    alignItems: "center",
    justifyContent: "center",
  },
});
