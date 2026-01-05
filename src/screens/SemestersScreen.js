import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import NewSemesterSheet from "../components/NewSemesterSheet";

export default function SemestersScreen() {
  const [showNewSemester, setShowNewSemester] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.header}>Semesters</Text>

        {/* Add Semester Button */}
        <Pressable
          style={styles.addButton}
          onPress={() => setShowNewSemester(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addText}>Add New Semester</Text>
        </Pressable>

        {/* Semester Cards */}
        <SemesterCard
          gpa="3.20"
          title="Fall 2024"
          courses="3 courses"
          credits="10 credits"
          status="In Progress"
          current
        />

        <SemesterCard
          gpa="3.43"
          title="Spring 2024"
          courses="2 courses"
          credits="7 credits"
          status="Completed"
        />

        <SemesterCard
          gpa="0.00"
          title="Fall 2023"
          courses="0 courses"
          credits="0 credits"
          status="Completed"
          empty
        />
      </ScrollView>

      {/* New Semester Bottom Sheet */}
      <NewSemesterSheet
        visible={showNewSemester}
        onClose={() => setShowNewSemester(false)}
      />
    </SafeAreaView>
  );
}

/* ---------- Semester Card ---------- */

function SemesterCard({ gpa, title, courses, credits, status, current, empty }) {
  return (
    <Pressable style={styles.card}>
      {/* GPA Circle */}
      <View
        style={[
          styles.gpaCircle,
          empty && { borderColor: "#D1D5DB" },
        ]}
      >
        <Text style={styles.gpaText}>{gpa}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          {current && <Badge text="Current" />}
        </View>

        <Text style={styles.meta}>
          {courses} · {credits}
        </Text>

        <StatusBadge text={status} />
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color="#9AA3B2" />
    </Pressable>
  );
}

/* ---------- Small Components ---------- */

function Badge({ text }) {
  return (
    <View style={styles.currentBadge}>
      <Text style={styles.currentText}>{text}</Text>
    </View>
  );
}

function StatusBadge({ text }) {
  const isProgress = text === "In Progress";
  return (
    <View
      style={[
        styles.statusBadge,
        isProgress ? styles.progress : styles.completed,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          isProgress ? styles.progressText : styles.completedText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 140, // BottomTabBar space
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C6CF2",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 8,
  },
  addText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  gpaCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 6,
    borderColor: "#E6B84C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  gpaText: {
    fontSize: 15,
    fontWeight: "700",
  },

  info: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginVertical: 4,
  },

  currentBadge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentText: {
    fontSize: 11,
    color: "#4F46E5",
    fontWeight: "600",
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progress: {
    backgroundColor: "#E0ECFF",
  },
  completed: {
    backgroundColor: "#E7F8ED",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressText: {
    color: "#2563EB",
  },
  completedText: {
    color: "#15803D",
  },
});
