import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>GradeTrack</Text>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons
              name="pencil-ruler"
              size={28}
              color="#FFFFFF"
            />
          </View>
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
  card: {
    width: "86%",
    maxWidth: 420,
    height: 380,
    borderRadius: 28,
    backgroundColor: "#303446",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  brandText: {
    color: "#F4B35E",
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  iconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#4A4E60",
    alignItems: "center",
    justifyContent: "center",
  },
});
