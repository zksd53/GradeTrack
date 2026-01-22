import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import UpdateAssessmentSheet from "../components/UpdateAssessmentSheet";
import { ThemeContext } from "../theme";

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
  const { theme } = useContext(ThemeContext);
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
      style={[styles.container, { backgroundColor: theme.background }]}
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

      <View style={styles.contentWrap}>
        <View style={styles.ringRow}>
          <RingCard
            value={cumulativeGpa === null ? "0.00" : cumulativeGpa.toFixed(2)}
            label="Cumulative"
            progress={cumulativeRing}
            theme={theme}
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
            theme={theme}
          />
        </View>

        <View style={styles.miniRow}>
          <MiniStat
            icon="book-outline"
            iconColor="#4F46E5"
            value={String(creditsThisTerm)}
            label="this term"
            theme={theme}
          />
          <MiniStat
            icon="radio-button-on"
            iconColor="#10B981"
            value={String(activeCourses)}
            label="Active"
            theme={theme}
          />
        </View>

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Current Courses
          </Text>
          <Pressable style={styles.viewAll}>
            <Text style={[styles.viewAllText, { color: theme.accent }]}>
              View All
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.accent} />
          </Pressable>
        </View>

        {currentCourses.length === 0 && (
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            No courses yet
          </Text>
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
              theme={theme}
            />
          );
        })}
      </View>

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

function RingCard({ value, label, progress, theme }) {
  return (
    <View style={[styles.ringCard, { backgroundColor: theme.card }]}>
      <ProgressRing value={value} progress={progress} theme={theme} />
      <Text style={[styles.ringLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

function MiniStat({ icon, iconColor, value, label, theme }) {
  return (
    <View style={[styles.miniCard, { backgroundColor: theme.card }]}>
      <View style={[styles.miniIconWrap, { backgroundColor: theme.cardAlt }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View>
        <Text style={[styles.miniValue, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.miniLabel, { color: theme.muted }]}>{label}</Text>
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
  theme,
}) {
  const accentColors = ["#EC4899", "#F97316", "#8B5CF6", "#6366F1"];
  const accent = accentColors[Math.abs(title.length) % accentColors.length];
  return (
    <Pressable
      style={[styles.courseCard, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <View style={[styles.courseAccent, { borderColor: accent }]} />
      <View style={styles.courseLeft}>
        <ProgressRing
          value={`${Math.round(progress)}%`}
          progress={progress}
          theme={theme}
        />
      </View>
      <View style={styles.courseBody}>
        <Text style={[styles.courseTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.courseCode, { color: theme.muted }]}>{code}</Text>
        <View style={styles.courseMeta}>
          <Ionicons name="time-outline" size={12} color={theme.muted} />
          <Text style={[styles.courseMetaText, { color: theme.muted }]}> 
            {credits || 0} credits
          </Text>
          {grade !== "No grades yet" && (
            <View style={[styles.gradePill, { backgroundColor: theme.cardAlt }]}> 
              <Text style={[styles.gradePillText, { color: gradeColor }]}> 
                {grade}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.muted} />
    </Pressable>
  );
}

function ProgressRing({ value, progress, theme }) {
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
            { borderLeftColor: theme.border, borderBottomColor: theme.border },
            { transform: [{ rotate: `${rightRotation}deg` }] },
          ]}
        />
      </View>
      <View style={styles.ringHalf}>
        <View
          style={[
            styles.ringCircle,
            styles.ringLeft,
            { borderRightColor: theme.border, borderTopColor: theme.border },
            { transform: [{ rotate: `${leftRotation}deg` }] },
          ]}
        />
      </View>
      <View style={[styles.ringInner, { backgroundColor: theme.card }]}>
        <Text style={[styles.ringValue, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  hero: {
    backgroundColor: "#5B3FE4",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 24,
    paddingTop: 28,
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
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },

  contentWrap: {
    paddingHorizontal: 16,
    marginTop: -40,
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
  },
  ringRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  ringCard: {
    width: "48%",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  ringLabel: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
  },

  miniRow: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  miniCard: {
    flex: 1,
    borderRadius: 16,
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
    alignItems: "center",
    justifyContent: "center",
  },
  miniValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  miniLabel: {
    fontSize: 12,
    marginTop: 2,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: { fontSize: 13, fontWeight: "600" },
  emptyText: {
    fontSize: 13,
    marginBottom: 12,
  },

  courseCard: {
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  courseAccent: {
    width: 6,
    height: 56,
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
  },
  courseCode: {
    fontSize: 12,
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
  },
  gradePill: {
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
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  ringHalf: {
    position: "absolute",
    width: 60,
    height: 60,
    overflow: "hidden",
  },
  ringCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  ringValue: {
    fontSize: 12,
    fontWeight: "700",
  },
});
