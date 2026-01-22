import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import UpdateAssessmentSheet from "../components/UpdateAssessmentSheet";

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
  if (percent === null) return "#9CA3AF";
  if (percent >= 85) return "#22C55E";
  if (percent >= 70) return "#F59E0B";
  return "#EF4444";
};

const getCourseProgress = (course) => {
  const assessments = Array.isArray(course.assessments)
    ? course.assessments
    : [];
  const totalWeight = assessments.reduce(
    (sum, a) => sum + (Number(a.weight) || 0),
    0
  );
  const completedWeight = assessments.reduce(
    (sum, a) =>
      sum + (typeof a.score === "number" ? Number(a.weight) || 0 : 0),
    0
  );
  if (totalWeight === 0) return 0;
  return Math.min(100, (completedWeight / totalWeight) * 100);
};

const getCurrentSemester = (semesters) => {
  if (!semesters.length) return null;
  const current = semesters.find((s) => s.current);
  if (current) return current;
  return semesters
    .slice()
    .sort((a, b) => (b.year || 0) - (a.year || 0))[0];
};

export default function HomeScreen({
  semesters = [],
  onOpenCourse,
  onUpdateAssessment,
}) {
  const currentSemester = getCurrentSemester(semesters);
  const currentStats = currentSemester
    ? getSemesterStats(currentSemester)
    : { credits: 0, courseCount: 0, semesterGpa: null };
  const cumulativeGpa = getCumulativeGpa(semesters);
  const currentCourses = Array.isArray(currentSemester?.courses)
    ? currentSemester.courses
    : [];
  const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
  const activeCourses = currentCourses.length;
  const creditsThisTerm = currentStats.credits;
  const cumulativeRing = cumulativeGpa === null ? 0 : (cumulativeGpa / 4) * 100;
  const semesterRing =
    currentStats.semesterGpa === null ? 0 : (currentStats.semesterGpa / 4) * 100;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.brandRow}>
            <Ionicons name="school-outline" size={16} color="#E0E7FF" />
            <Text style={styles.brandText}>GradeTrack</Text>
          </View>
          <Pressable
            style={styles.updateButton}
            onPress={() => setShowUpdateAssessment(true)}
          >
            <Text style={styles.updateButtonText}>Update Assessment</Text>
          </Pressable>
        </View>
        <Text style={styles.welcome}>Welcome back! 👋</Text>
        <Text style={styles.semester}>
          {currentSemester
            ? `${currentSemester.term} ${currentSemester.year}`
            : "No current semester"}
        </Text>
      </View>

      <View style={styles.ringRow}>
        <RingCard
          value={cumulativeGpa === null ? "0.00" : cumulativeGpa.toFixed(2)}
          label="Cumulative"
          progress={cumulativeRing}
        />
        <RingCard
          value={
            currentStats.semesterGpa === null
              ? "0.00"
              : currentStats.semesterGpa.toFixed(2)
          }
          label={
            currentSemester
              ? `${currentSemester.term} ${currentSemester.year}`
              : "Semester"
          }
          progress={semesterRing}
        />
      </View>

      <View style={styles.miniRow}>
        <MiniStat
          icon="book-outline"
          iconColor="#4F46E5"
          value={String(creditsThisTerm)}
          label="this term"
        />
        <MiniStat
          icon="radio-button-on"
          iconColor="#10B981"
          value={String(activeCourses)}
          label="Active"
        />
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Current Courses</Text>
        <Pressable style={styles.viewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#6366F1" />
        </Pressable>
      </View>

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
            progress={getCourseProgress(course)}
            credits={course.credits}
            onPress={() => {
              if (currentSemester && onOpenCourse) {
                onOpenCourse(currentSemester.id, course.id);
              }
            }}
          />
        );
      })}

      <UpdateAssessmentSheet
        visible={showUpdateAssessment}
        onClose={() => setShowUpdateAssessment(false)}
        courses={currentCourses}
        onSave={(courseId, assessmentId, score) => {
          if (!currentSemester || !onUpdateAssessment) return;
          onUpdateAssessment(currentSemester.id, courseId, assessmentId, {
            score,
          });
        }}
      />
    </ScrollView>
  );
}

function RingCard({ value, label, progress }) {
  return (
    <View style={styles.ringCard}>
      <ProgressRing value={value} progress={progress} />
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
}

function MiniStat({ icon, iconColor, value, label }) {
  return (
    <View style={styles.miniCard}>
      <View style={styles.miniIconWrap}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View>
        <Text style={styles.miniValue}>{value}</Text>
        <Text style={styles.miniLabel}>{label}</Text>
      </View>
    </View>
  );
}

function CourseCard({
  title,
  code,
  grade,
  gradeColor,
  progress,
  credits,
  onPress,
}) {
  const accentColors = ["#EC4899", "#F97316", "#8B5CF6", "#6366F1"];
  const accent = accentColors[Math.abs(title.length) % accentColors.length];
  return (
    <Pressable style={styles.courseCard} onPress={onPress}>
      <View style={[styles.courseAccent, { borderColor: accent }]} />
      <View style={styles.courseLeft}>
        <ProgressRing value={`${Math.round(progress)}%`} progress={progress} />
      </View>
      <View style={styles.courseBody}>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseCode}>{code}</Text>
        <View style={styles.courseMeta}>
          <Ionicons name="time-outline" size={12} color="#94A3B8" />
          <Text style={styles.courseMetaText}>{credits || 0} credits</Text>
          {grade !== "No grades yet" && (
            <View style={styles.gradePill}>
              <Text style={[styles.gradePillText, { color: gradeColor }]}>
                {grade}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </Pressable>
  );
}

function ProgressRing({ value, progress }) {
  const progressAngle = Math.min(360, Math.max(0, progress * 3.6));
  const rightRotation = progressAngle <= 180 ? progressAngle : 180;
  const leftRotation = progressAngle > 180 ? progressAngle - 180 : 0;
  return (
    <View style={styles.ring}>
      <View style={styles.ringHalf}>
        <View
          style={[
            styles.ringCircle,
            styles.ringRight,
            { transform: [{ rotate: `${rightRotation}deg` }] },
          ]}
        />
      </View>
      <View style={styles.ringHalf}>
        <View
          style={[
            styles.ringCircle,
            styles.ringLeft,
            { transform: [{ rotate: `${leftRotation}deg` }] },
          ]}
        />
      </View>
      <View style={styles.ringInner}>
        <Text style={styles.ringValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F6FB",
  },

  hero: {
    backgroundColor: "#5B3FE4",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    paddingTop: 24,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    color: "#E0E7FF",
    fontSize: 13,
    fontWeight: "600",
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF",
  },
  semester: {
    fontSize: 14,
    color: "#D6D1FF",
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },

  ringRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: -40,
  },
  ringCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 6,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  ringLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 10,
    fontWeight: "600",
  },

  miniRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  miniIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  miniValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  miniLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: { fontSize: 13, color: "#6366F1", fontWeight: "600" },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  courseCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  courseAccent: {
    width: 6,
    height: "100%",
    borderRadius: 6,
    borderWidth: 3,
    marginRight: 12,
  },
  courseLeft: {
    marginRight: 12,
  },
  courseBody: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  courseCode: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  courseMetaText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  gradePill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  gradePillText: {
    fontSize: 11,
    fontWeight: "600",
  },

  ring: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  ringHalf: {
    position: "absolute",
    width: 56,
    height: 56,
    overflow: "hidden",
  },
  ringCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 6,
    borderColor: "#F59E0B",
  },
  ringRight: {
    position: "absolute",
    right: 0,
    borderLeftColor: "#E2E8F0",
    borderBottomColor: "#E2E8F0",
  },
  ringLeft: {
    position: "absolute",
    left: 0,
    borderRightColor: "#E2E8F0",
    borderTopColor: "#E2E8F0",
  },
  ringInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  ringValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
});
