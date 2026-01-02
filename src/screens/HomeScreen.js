import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";

import StatCard from "../components/StatCard";
import CourseCard from "../components/CourseCard";

export default function HomeScreen() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      title: "Data Structures",
      code: "COMP 2140",
      grade: "B+ (87%)",
      credits: 3,
    },
    {
      title: "Calculus II",
      code: "MATH 2020",
      grade: "B (82%)",
      credits: 4,
    },
    {
      title: "Physics I",
      code: "PHYS 1050",
      grade: "C+ (79%)",
      credits: 4,
    },
    {
      title: "Academic Writing",
      code: "ENG 0930",
      grade: "A (92%)",
      credits: 3,
    },
  ];

  if (selectedCourse) {
    return (
      <CourseDetailScreen
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Fall 2024</Text>

      {/* Primary GPA */}
      <View style={styles.primaryCard}>
        <Text style={styles.primaryValue}>3.29</Text>
        <Text style={styles.primaryLabel}>Cumulative GPA</Text>
      </View>

      {/* Stats */}
      <View style={styles.row}>
        <StatCard value="3.20" label="Semester GPA" />
        <StatCard value="17" label="Credits" />
        <StatCard value="4" label="Courses" />
      </View>

      {/* Courses */}
      <Text style={styles.sectionTitle}>Current Courses</Text>

      {courses.map((course) => (
        <CourseCard
          key={course.code}
          title={course.title}
          code={course.code}
          grade={course.grade}
          onPress={() => setSelectedCourse(course)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
  },
  primaryCard: {
    backgroundColor: "#1C2436",
    borderRadius: 16,
    paddingVertical: 26,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryValue: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#9AA3B2",
    marginTop: 6,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },
});
