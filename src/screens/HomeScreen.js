import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="school-outline" size={20} color="#FFF" />
        <Text style={styles.welcome}>Welcome back! 👋</Text>
        <Text style={styles.semester}>Fall 2024</Text>
      </View>

      {/* Cumulative GPA */}
      <View style={styles.gpaCard}>
        <Text style={styles.gpaValue}>3.29</Text>
        <Text style={styles.gpaLabel}>Cumulative GPA</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat value="3.20" label="Semester GPA" />
        <Stat value="17" label="Credits" />
        <Stat value="4" label="Courses" />
      </View>

      {/* Current Courses */}
      <Text style={styles.sectionTitle}>Current Courses</Text>

      <CourseCard
        title="Data Structures"
        code="COMP 2140"
        grade="B+ (87%)"
      />

      <CourseCard
        title="Calculus II"
        code="MATH 2020"
        grade="B (82%)"
      />

      <CourseCard
        title="Physics I"
        code="PHYS 1050"
        grade="C+ (79%)"
      />

      <CourseCard
        title="Academic Writing"
        code="ENG 0930"
        grade="A (92%)"
      />
    </ScrollView>
  );
}

/* ---------- Small Components ---------- */

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CourseCard({ title, code, grade }) {
  return (
    <View style={styles.courseCard}>
      <View>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseCode}>{code}</Text>
      </View>

      <Text style={styles.grade}>{grade}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B1020",
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 8,
  },
  semester: {
    fontSize: 14,
    color: "#AAB1C5",
    marginTop: 4,
  },

  gpaCard: {
    backgroundColor: "#1C2436",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  gpaValue: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFF",
  },
  gpaLabel: {
    fontSize: 14,
    color: "#AAB1C5",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    backgroundColor: "#1C2436",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#AAB1C5",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
  },

  courseCard: {
    backgroundColor: "#1C2436",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
  courseCode: {
    fontSize: 12,
    color: "#AAB1C5",
    marginTop: 2,
  },
  grade: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4ADE80",
  },
});
