import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { ThemeContext } from "../theme";

// Components
import NewSemesterSheet from "../components/NewSemesterSheet";

/* ---------- Screen ---------- */

export default function SemestersScreen({
  semesters,
  saveSemesters,
  onOpenSemester,
}) {
  const [showNewSemester, setShowNewSemester] = useState(false);
  const { theme } = useContext(ThemeContext);

  console.log("SemestersScreen render. semesters:", semesters);

  /* ---------- Handlers ---------- */

  const handleAddSemester = (newSemester) => {
    console.log("Adding semester:", newSemester);
    saveSemesters([...semesters, newSemester]);
  };

  /* ---------- List View ---------- */

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showNewSemester}
      >
        <Text style={[styles.header, { color: theme.text }]}>Semesters</Text>

        <Pressable
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={() => setShowNewSemester(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addText}>Add New Semester</Text>
        </Pressable>

        {semesters.map((s) => (
          <SemesterCard
            key={s.id}
            gpa={s.gpa}
            title={`${s.term} ${s.year}`}
            courses={s.courses}
            status={s.status}
            current={s.current}
            theme={theme}
            onPress={() => {
              console.log("SEMESTER CLICKED:", s.id);
              onOpenSemester(s.id);
            }}
          />
        ))}
      </ScrollView>

      <NewSemesterSheet
        visible={showNewSemester}
        onClose={() => setShowNewSemester(false)}
        onCreate={handleAddSemester}
      />
    </SafeAreaView>
  );
}

/* ---------- Semester Card ---------- */

function SemesterCard({
  gpa,
  title,
  courses,
  status,
  current,
  onPress,
  theme,
}) {
  const safeCourses = Array.isArray(courses) ? courses : [];

  const totalCredits = safeCourses.reduce(
    (sum, c) => sum + (Number(c?.credits) || 0),
    0
  );

  const semesterGpa = (() => {
    const weighted = safeCourses.reduce((sum, course) => {
      const assessments = Array.isArray(course.assessments)
        ? course.assessments
        : [];
      const completedWeight = assessments.reduce(
        (inner, a) =>
          inner + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
        0
      );
      if (completedWeight < 100) return sum;
      const gained = assessments.reduce((inner, a) => {
        if (typeof a.score !== "number") return inner;
        const weight = Number(a.weight) || 0;
        return inner + (weight * a.score) / 100;
      }, 0);
      const percent = completedWeight > 0 ? (gained / completedWeight) * 100 : 0;
      let courseGpa = 0;
      if (percent >= 90) courseGpa = 4.0;
      else if (percent >= 85) courseGpa = 3.7;
      else if (percent >= 80) courseGpa = 3.3;
      else if (percent >= 75) courseGpa = 3.0;
      else if (percent >= 70) courseGpa = 2.7;
      else if (percent >= 65) courseGpa = 2.3;
      else if (percent >= 60) courseGpa = 2.0;
      else if (percent >= 55) courseGpa = 1.0;
      return sum + courseGpa * (Number(course.credits) || 0);
    }, 0);

    const creditTotal = safeCourses.reduce((sum, course) => {
      const assessments = Array.isArray(course.assessments)
        ? course.assessments
        : [];
      const completedWeight = assessments.reduce(
        (inner, a) =>
          inner + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
        0
      );
      if (completedWeight < 100) return sum;
      return sum + (Number(course.credits) || 0);
    }, 0);

    if (creditTotal === 0) return "0.00";
    return (weighted / creditTotal).toFixed(2);
  })();

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={styles.gpaCircle}>
        <Text style={[styles.gpaText, { color: theme.text }]}>
          {semesterGpa}
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {current && <Badge text="Current" />}
        </View>

        <Text style={[styles.meta, { color: theme.muted }]}>
          {safeCourses.length} course{safeCourses.length !== 1 ? "s" : ""} ·{" "}
          {totalCredits} credits
        </Text>

        <StatusBadge text={status} theme={theme} />
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.muted} />
    </Pressable>
  );
}

/* ---------- Badges ---------- */

function Badge({ text }) {
  return (
    <View style={styles.currentBadge}>
      <Text style={styles.currentText}>{text}</Text>
    </View>
  );
}

function StatusBadge({ text, theme }) {
  const isProgress = text === "In Progress";
  return (
    <View
      style={[
        styles.statusBadge,
        isProgress
          ? styles.progress
          : styles.completed,
        isProgress
          ? { backgroundColor: "#E0ECFF" }
          : { backgroundColor: "#E7F8ED" },
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
  safe: { flex: 1, backgroundColor: "#F7F8FC" },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 140 },

  header: { fontSize: 24, fontWeight: "700", marginBottom: 16 },

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
  addText: { color: "#FFF", fontSize: 15, fontWeight: "600" },

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
  gpaText: { fontSize: 15, fontWeight: "700" },

  info: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 13, color: "#6B7280", marginVertical: 4 },

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
  progress: { backgroundColor: "#E0ECFF" },
  completed: { backgroundColor: "#E7F8ED" },
  statusText: { fontSize: 12, fontWeight: "600" },
  progressText: { color: "#2563EB" },
  completedText: { color: "#15803D" },
});
