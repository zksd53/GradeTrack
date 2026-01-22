import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const gradeScale = [
  { min: 90, letter: "A", gpa: 4.0 },
  { min: 85, letter: "A-", gpa: 3.7 },
  { min: 80, letter: "B+", gpa: 3.3 },
  { min: 75, letter: "B", gpa: 3.0 },
  { min: 70, letter: "B-", gpa: 2.7 },
  { min: 65, letter: "C+", gpa: 2.3 },
  { min: 60, letter: "C", gpa: 2.0 },
  { min: 55, letter: "D", gpa: 1.0 },
  { min: 0, letter: "F", gpa: 0.0 },
];

const getGradeInfo = (percent) => {
  if (percent === null) return null;
  return (
    gradeScale.find((grade) => percent >= grade.min) ||
    gradeScale[gradeScale.length - 1]
  );
};

const getCoursePercent = (course) => {
  const assessments = Array.isArray(course.assessments)
    ? course.assessments
    : [];
  const completedWeight = assessments.reduce(
    (sum, a) =>
      sum + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
    0
  );
  const gained = assessments.reduce((sum, a) => {
    if (typeof a.score !== "number") return sum;
    const weight = Number(a.weight) || 0;
    return sum + (weight * a.score) / 100;
  }, 0);
  if (completedWeight === 0) return null;
  return (gained / completedWeight) * 100;
};

const getSemesterStats = (semester) => {
  const courses = Array.isArray(semester?.courses) ? semester.courses : [];
  const credits = courses.reduce(
    (sum, c) => sum + (Number(c.credits) || 0),
    0
  );
  const gradedCourses = courses
    .map((course) => {
      const percent = getCoursePercent(course);
      if (percent === null) return null;
      const grade = getGradeInfo(percent);
      return {
        course,
        percent,
        gpa: grade?.gpa ?? null,
      };
    })
    .filter(Boolean);
  const totalCreditWeight = gradedCourses.reduce(
    (sum, c) => sum + (Number(c.course.credits) || 0),
    0
  );
  const weightedGpa =
    totalCreditWeight > 0
      ? gradedCourses.reduce(
          (sum, c) => sum + c.gpa * (Number(c.course.credits) || 0),
          0
        ) / totalCreditWeight
      : null;
  return {
    credits,
    courseCount: courses.length,
    semesterGpa: weightedGpa,
  };
};

const getCumulativeGpa = (semesters) => {
  const courses = semesters.flatMap((s) =>
    Array.isArray(s.courses) ? s.courses : []
  );
  const gradedCourses = courses
    .map((course) => {
      const percent = getCoursePercent(course);
      if (percent === null) return null;
      const grade = getGradeInfo(percent);
      return {
        gpa: grade?.gpa ?? null,
        credits: Number(course.credits) || 0,
      };
    })
    .filter(Boolean);
  const totalCredits = gradedCourses.reduce(
    (sum, c) => sum + (c.credits || 0),
    0
  );
  if (totalCredits === 0) return null;
  const weightedGpa =
    gradedCourses.reduce((sum, c) => sum + c.gpa * c.credits, 0) /
    totalCredits;
  return weightedGpa;
};

const getGradeColor = (percent) => {
  if (percent === null) return "#AAB1C5";
  if (percent >= 85) return "#4ADE80";
  if (percent >= 70) return "#F59E0B";
  return "#EF4444";
};

const getCurrentSemester = (semesters) => {
  if (!semesters.length) return null;
  const current = semesters.find((s) => s.current);
  if (current) return current;
  return semesters
    .slice()
    .sort((a, b) => (b.year || 0) - (a.year || 0))[0];
};

export default function HomeScreen({ semesters = [], onOpenCourse }) {
  const currentSemester = getCurrentSemester(semesters);
  const currentStats = currentSemester
    ? getSemesterStats(currentSemester)
    : { credits: 0, courseCount: 0, semesterGpa: null };
  const cumulativeGpa = getCumulativeGpa(semesters);
  const currentCourses = Array.isArray(currentSemester?.courses)
    ? currentSemester.courses
    : [];

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
        <Text style={styles.semester}>
          {currentSemester
            ? `${currentSemester.term} ${currentSemester.year}`
            : "No current semester"}
        </Text>
      </View>

      {/* Cumulative GPA */}
      <View style={styles.gpaCard}>
        <Text style={styles.gpaValue}>
          {cumulativeGpa === null ? "0.00" : cumulativeGpa.toFixed(2)}
        </Text>
        <Text style={styles.gpaLabel}>Cumulative GPA</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat
          value={
            currentStats.semesterGpa === null
              ? "0.00"
              : currentStats.semesterGpa.toFixed(2)
          }
          label="Semester GPA"
        />
        <Stat value={String(currentStats.credits)} label="Credits" />
        <Stat value={String(currentStats.courseCount)} label="Courses" />
      </View>

      {/* Current Courses */}
      <Text style={styles.sectionTitle}>Current Courses</Text>

      {currentCourses.length === 0 && (
        <Text style={styles.emptyText}>No courses yet</Text>
      )}
      {currentCourses.map((course) => {
        const percent = getCoursePercent(course);
        const grade = getGradeInfo(percent);
        const gradeText =
          percent === null
            ? "No grades yet"
            : `${grade?.letter} (${percent.toFixed(0)}%)`;
        return (
          <CourseCard
            key={course.id}
            title={course.name}
            code={course.code || "—"}
            grade={gradeText}
            gradeColor={getGradeColor(percent)}
            onPress={() => {
              if (currentSemester && onOpenCourse) {
                onOpenCourse(currentSemester.id, course.id);
              }
            }}
          />
        );
      })}
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

function CourseCard({ title, code, grade, gradeColor, onPress }) {
  return (
    <Pressable style={styles.courseCard} onPress={onPress}>
      <View>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseCode}>{code}</Text>
      </View>

      <Text style={[styles.grade, gradeColor ? { color: gradeColor } : null]}>
        {grade}
      </Text>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5ff",
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000ff",
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
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
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
